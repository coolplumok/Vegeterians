class Api::V1::AmbassadorsController < Api::BaseController
  def index
    event_type = params[:event][:type]
    email = params[:data][:promoter][:email]
    auth_token = params[:data][:promoter][:auth_token]

    if event_type == "promoter_accepted"
      user = User.find_by email: email
    
      if user
        user.promoter_auth_token = auth_token
        user.save

        render json: { message: 'success' }
      else
        render json: { message: 'failed' }
      end
    end

  end
end
