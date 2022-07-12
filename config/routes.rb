# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Sidekiq::Web.set :session_secret, Rails.application.secrets[:secret_key_base]

username_regex = /([^\/]*)/
html_only = lambda { |req| req.format.nil? || req.format.html? }

Rails.application.routes.draw do

  mount StripeEvent::Engine, at: '/stripe-webhooks' # provide a custom path

  mount LetterOpenerWeb::Engine, at: 'letter_opener' if Rails.env.development?

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web, at: 'sidekiq', as: :sidekiq
    mount PgHero::Engine, at: 'pghero', as: :pghero
  end

  use_doorkeeper do
    controllers authorizations: 'oauth/authorizations',
                authorized_applications: 'oauth/authorized_applications',
                tokens: 'oauth/tokens'
  end

  get '.well-known/host-meta', to: 'well_known/host_meta#show', as: :host_meta
  get '.well-known/webfinger', to: 'well_known/webfinger#show', as: :webfinger
  get '.well-known/change-password', to: redirect('/auth/edit')
  get '.well-known/keybase-proof-config', to: 'well_known/keybase_proof_config#show'

  get 'manifest', to: 'manifests#show', defaults: { format: 'json' }
  get 'intent', to: 'intents#show'

  devise_scope :user do
    get '/invite/:invite_code', to: 'auth/registrations#new', as: :public_invite
    match '/auth/finish_signup' => 'auth/confirmations#finish_signup', via: [:get, :patch], as: :finish_signup
  end

  devise_for :users, path: 'auth', controllers: {
    omniauth_callbacks: 'auth/omniauth_callbacks',
    sessions:           'auth/sessions',
    registrations:      'auth/registrations',
    passwords:          'auth/passwords',
    confirmations:      'auth/confirmations',
  }

  get '/users/:username', to: redirect('/%{username}'), constraints: html_only, username: username_regex
  get '/users/:username/followers', to: redirect('/%{username}/followers'), constraints: html_only, username: username_regex
  get '/users/:username/following', to: redirect('/%{username}/following'), constraints: html_only, username: username_regex
  get '/users/:username/statuses/:id', to: redirect('/%{username}/posts/%{id}'), constraints: html_only, username: username_regex

  get '/authorize_follow', to: redirect { |_, request| "/authorize_interaction?#{request.params.to_query}" }

  resources :accounts, path: 'users', only: [:show], param: :username do
    resources :stream_entries, path: 'updates', only: [:show] do
      member do
        get :embed
      end
    end

    # get :remote_follow,  to: 'remote_follow#new'
    # post :remote_follow, to: 'remote_follow#create'

    resources :statuses, only: [:show] do
      member do
        get :activity
        get :embed
        get :replies
      end
    end

    resources :followers, only: [:index], controller: :follower_accounts
    resources :following, only: [:index], controller: :following_accounts
    resource :follow, only: [:create], controller: :account_follow
    resource :unfollow, only: [:create], controller: :account_unfollow

    # resource :outbox, only: [:show], module: :activitypub
    # resource :inbox, only: [:create], module: :activitypub
    # resources :collections, only: [:show], module: :activitypub
  end

  # resource :inbox, only: [:create], module: :activitypub

  get  '/interact/:id', to: 'remote_interaction#new', as: :remote_interaction
  post '/interact/:id', to: 'remote_interaction#create'

  namespace :settings do
    resources :memberships, only: [:index] do
      collection do
        post :cancel
        post :change_membership
        post :create_checkout_session
      end
    end
    resource :profile, only: [:show, :update]
    resource :preferences, only: [:show, :update]
    resource :notifications, only: [:show, :update]
    # resource :import, only: [:show, :create]

    namespace :billing do
      get :upgrade, to: 'upgrade#index', as: :upgrade
      get :transactions, to: 'transactions#index', as: :transactions
      post '/btcpay-notification', to: 'upgrade#btcpay_notification', as: :btcpay_notification
    end

    resources :promotions, only: [:index, :new, :create, :edit, :update, :destroy]
    resources :expenses, only: [:index, :new, :create, :edit, :update, :destroy]

    namespace :verifications do
      get :moderation, to: 'moderation#index', as: :moderation
      get 'moderation/:id/approve', to: 'moderation#approve', as: :approve
      get 'moderation/:id/reject', to: 'moderation#reject', as: :reject

      resources :requests, only: [:index, :create]
      post 'requests/sendcode', to: 'requests#send_code', as: :sendcode
      post 'requests/verifycode', to: 'requests#verify_code', as: :verifycode
    end

    resource :export, only: [:show, :create]
    namespace :exports, constraints: { format: :csv } do
      resources :follows, only: :index, controller: :following_accounts
      resources :blocks, only: :index, controller: :blocked_accounts
      resources :mutes, only: :index, controller: :muted_accounts
      resources :lists, only: :index, controller: :lists
      resources :domain_blocks, only: :index, controller: :blocked_domains
    end

    resource :two_factor_authentication, only: [:show, :create, :destroy]
    namespace :two_factor_authentication do
      resources :recovery_codes, only: [:create]
      resource :confirmation, only: [:new, :create]
    end

    resources :identity_proofs, only: [:index, :show, :new, :create, :update]

    resources :applications, except: [:edit] do
      member do
        post :regenerate
      end
    end

    resource :delete, only: [:show, :destroy]
    # resource :migration, only: [:show, :update]

    resources :sessions, only: [:destroy]
    resources :scheduled_statuses, only: [:index, :destroy]
  end

  resources :media, only: [:show] do
    get :player
  end

  resources :emojis, only: [:show]
  # resources :invites, only: [:index, :create, :destroy]
  resources :filters, except: [:show]
  # resource :relationships, only: [:show, :update]

  get '/public', to: redirect('/home'), as: :public_timeline # homehack
  get '/media_proxy/:id/(*any)', to: 'media_proxy#show', as: :media_proxy

  # Remote follow
  # resource :remote_unfollow, only: [:create]
  # resource :authorize_interaction, only: [:show, :create]
  # resource :share, only: [:show, :create]

  namespace :admin do
    get '/dashboard', to: 'dashboard#index'

    resources :subscriptions, only: [:index]
    resources :domain_blocks, only: [:new, :create, :show, :destroy]
    resources :email_domain_blocks, only: [:index, :new, :create, :destroy]
    resources :action_logs, only: [:index]
    resources :warning_presets, except: [:new]
    resource :settings, only: [:edit, :update]

    resources :invites, only: [:index, :create, :destroy] do
      collection do
        post :deactivate_all
      end
    end

    resources :relays, only: [:index, :new, :create, :destroy] do
      member do
        post :enable
        post :disable
      end
    end

    resources :instances, only: [:index, :show], constraints: { id: /[^\/]+/ }

    resources :reports, only: [:index, :show] do
      member do
        post :assign_to_self
        post :unassign
        post :reopen
        post :resolve
      end

      resources :reported_statuses, only: [:create]
    end

    resources :report_notes, only: [:create, :destroy]

    resources :accounts, only: [:index, :show, :edit, :update] do
      member do
        post :subscribe
        post :unsubscribe
        post :enable
        post :unsilence
        post :unsuspend
        post :redownload
        post :remove_avatar
        post :remove_header
        post :memorialize
        post :approve
        post :reject
        post :verify
        post :unverify
        post :add_proplus_badge
        post :remove_proplus_badge
        post :add_expert_badge
        post :remove_expert_badge
        get :edit_pro
        put :save_pro
      end

      resource :change_email, only: [:show, :update]
      resource :reset, only: [:create]
      resource :action, only: [:new, :create], controller: 'account_actions'
      resources :statuses, only: [:index, :show, :create, :update, :destroy]
      resources :followers, only: [:index]

      resource :confirmation, only: [:create] do
        collection do
          post :resend
        end
      end

      resource :role do
        member do
          post :promote
          post :demote
        end
      end
    end

    resources :pending_accounts, only: [:index] do
      collection do
        post :approve_all
        post :reject_all
        post :batch
      end
    end

    resources :users, only: [] do
      resource :two_factor_authentication, only: [:destroy]
    end

    resources :custom_emojis, only: [:index, :new, :create, :update, :destroy] do
      member do
        post :copy
        post :enable
        post :disable
      end
    end

    resources :groups, only: [:index, :destroy] do
      member do
        post :enable_featured
        post :disable_featured
        post :enable_privated
        post :disable_privated
      end
    end

    resources :account_moderation_notes, only: [:create, :destroy]

    resources :tags, only: [:index] do
      member do
        post :hide
        post :unhide
      end
    end
  end

  get '/admin', to: redirect('/admin/dashboard', status: 302)

  namespace :api do
    # PubSubHubbub outgoing subscriptions
    resources :subscriptions, only: [:show]
    post '/subscriptions/:id', to: 'subscriptions#update'

    # PubSubHubbub incoming subscriptions
    post '/push', to: 'push#update', as: :push

    # Salmon
    post '/salmon/:id', to: 'salmon#update', as: :salmon

    # OEmbed
    get '/oembed', to: 'oembed#show', as: :oembed

    # Identity proofs
    get :proofs, to: 'proofs#index'

    # JSON / REST API
    namespace :v1 do
      post '/ambassadors/webhook', to: 'ambassadors#index'

      resources :statuses, only: [:create, :update, :show, :destroy] do
        scope module: :statuses do
          resources :reblogged_by, controller: :reblogged_by_accounts, only: :index
          resources :favourited_by, controller: :favourited_by_accounts, only: :index
          resource :reblog, only: :create
          post :unreblog, to: 'reblogs#destroy'

          resource :favourite, only: :create
          post :unfavourite, to: 'favourites#destroy'


          resource :bookmark, only: :create
          post :unbookmark, to: 'bookmarks#destroy'

          resource :mute, only: :create
          post :unmute, to: 'mutes#destroy'

          resource :pin, only: :create
          post :unpin, to: 'pins#destroy'
        end

        member do
          get :comments
          get :context
          get :card
          get :revisions
        end
      end

      namespace :timelines do
        resource :direct, only: :show, controller: :direct
        resource :home, only: :show, controller: :home
        resource :public, only: :show, controller: :public
        resource :pro, only: :show, controller: :pro
        resource :expert, only: :show, controller: :expert
        resources :tag, only: :show
        resources :list, only: :show
        resources :group, only: :show
        resource :trends, only: :show, controller: :trends
      end
     
      resources :gab_trends, only: [:index]
      resources :shop, only: [:index]
      resources :streaming, only: [:index]
      resources :custom_emojis, only: [:index]
      resources :suggestions, only: [:index, :destroy]
      resources :scheduled_statuses, only: [:index, :show, :update, :destroy]
      resources :preferences, only: [:index]
      resources :trends, only: [:index]

      namespace :gifs do
        get :categories
        get :search
      end

      resources :conversations, only: [:index, :destroy] do
        member do
          post :read
        end
      end
      
      get '/plan', to: 'plans#price'

      get '/checkout_session', to: 'plans#checkout_session'

      get '/change_membership', to: 'plans#change_membership'
      
      get '/search', to: 'search#index', as: :search

      get '/account_by_username/:username', to: 'account_by_username#show', username: username_regex

      resources :follows,      only: [:create]
      resources :media,        only: [:create, :update]
      resources :blocks,       only: [:index]
      resources :mutes,        only: [:index]
      resources :favourites,   only: [:index]
      resources :reports,      only: [:create]
      resources :filters,      only: [:index, :create, :show, :update, :destroy]
      resources :endorsements, only: [:index]
      resources :shortcuts,    only: [:index, :create, :show, :destroy]
      resources :bookmarks,    only: [:index]

      namespace :apps do
        get :verify_credentials, to: 'credentials#show'
      end

      resources :apps, only: [:create]

      resource :instance, only: [:show] do
        resources :peers, only: [:index], controller: 'instances/peers'
        resource :activity, only: [:show], controller: 'instances/activity'
      end

      resource :domain_blocks, only: [:show, :create, :destroy]

      resources :follow_requests, only: [:index] do
        member do
          post :authorize
          post :reject
        end
      end

      resources :notifications, only: [:index, :show] do
        collection do
          post :clear
          post :dismiss # Deprecated
          post :mark_read
        end

        member do
          post :dismiss
        end
      end

      namespace :accounts do
        get :verify_credentials, to: 'credentials#show'
        patch :update_credentials, to: 'credentials#update'
        resource :search, only: :show, controller: :search
        resources :relationships, only: :index
      end

      resources :accounts, only: [:create, :show] do
        resources :statuses, only: :index, controller: 'accounts/statuses'
        resources :followers, only: :index, controller: 'accounts/follower_accounts'
        resources :following, only: :index, controller: 'accounts/following_accounts'
        resources :lists, only: :index, controller: 'accounts/lists'
        resources :suggestion, only: :index, controller: 'accounts/suggestion_accounts'
        resource :health_expert_application, only: [:index, :create, :destroy], controller: 'accounts/health_expert_application_accounts'
        resource :health_expert_approve, only: [:index, :create, :destroy], controller: 'accounts/health_expert_approve_accounts'

        member do
          post :follow
          post :unfollow
          post :block
          post :unblock
          post :mute
          post :unmute
        end

        resource :pin, only: :create, controller: 'accounts/pins'
        post :unpin, to: 'accounts/pins#destroy'
      end

      resources :lists, only: [:index, :create, :show, :update, :destroy] do
        resource :accounts, only: [:show, :create, :destroy], controller: 'lists/accounts'
      end
      resources :posts
      get '/add_boost_post', to: 'boost_posts#add_boost_post'
      get '/boosted_post', to: 'posts#boosted_post'
      get '/check_boosted_post/:id', to: 'posts#check_boosted_post'
      get '/check_user_pro_plus', to: 'posts#check_user_pro_plus'
      get '/boost_again/:id', to: 'posts#boost_again'
      get '/total_post', to: 'posts#total_post'
      resources :groups, only: [:index, :create, :show, :update, :destroy] do
        member do
          delete '/statuses/:status_id', to: 'groups#destroy_status'
          post '/statuses/:status_id/approve', to: 'groups#approve_status'
          post '/make_public', to: 'groups#make_public'
          post '/make_private', to: 'groups#make_private'
        end

        resources :relationships, only: :index, controller: 'groups/relationships'
        resource :accounts, only: [:show, :create, :update, :destroy], controller: 'groups/accounts'
        resource :removed_accounts, only: [:show, :create, :destroy], controller: 'groups/removed_accounts'
        resources :invite, only: :create, controller: 'groups/invite_followers'
        resource :join_private, only: [:show, :create, :destroy], controller: 'groups/join_private'
        resource :approve_join_private, only: [:show, :create, :destroy], controller: 'groups/approve_join_private'
      end

      resources :polls, only: [:create, :show] do
        resources :votes, only: :create, controller: 'polls/votes'
      end

      namespace :push do
        resource :subscription, only: [:create, :show, :update, :destroy]
      end
    end

    namespace :v2 do
      get '/search', to: 'search#index', as: :search
    end

    namespace :web do
      resource :settings, only: [:update]
      resource :embed, only: [:create]
      resources :push_subscriptions, only: [:create] do
        member do
          put :update
        end
      end
    end
  end

  get '/', to: 'about#show', as: :homepage

  get '/tags/:tag', to: 'react#react'
  get '/:username/with_replies', to: 'accounts#show', username: username_regex, as: :short_account_with_replies
  get '/:username/comments_only', to: 'accounts#show', username: username_regex, as: :short_account_comments_only
  get '/:username/media', to: 'accounts#show', username: username_regex, as: :short_account_media
  get '/:username/tagged/:tag', to: 'accounts#show', username: username_regex, as: :short_account_tag
  get '/:username/posts/:statusId/reblogs', to: 'statuses#show', username: username_regex
  get '/:account_username/posts/:id', to: 'statuses#show', account_username: username_regex, as: :short_account_status
  get '/:account_username/posts/:id/embed', to: 'statuses#embed', account_username: username_regex, as: :embed_short_account_status
  get '/(*any)', to: 'react#react', as: :web
  get '/:username', to: 'accounts#show', username: username_regex, as: :short_account
  root 'react#react'

  # Routes that are now to be used within webapp, but still referenced within application
  # TODO : Consolidate
  get '/explore', to: 'directories#index', as: :explore
  get '/explore/:id', to: 'directories#show', as: :explore_hashtag

  get '/about', to: 'about#more'
  get '/about/tos', to: 'about#terms'
  get '/about/privacy', to: 'about#privacy'
  get '/about/investors', to: 'about#investors'
  get '/about/copyright', to: 'about#copyright'
  get '/about/sales', to: 'about#sales'

  resources :tags, only: [:show]

  match '*unmatched_route',
        via: :all,
        to: 'application#raise_not_found',
        format: false
end
