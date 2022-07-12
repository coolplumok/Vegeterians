# frozen_string_literal: true

class ReportService < BaseService
  def call(source_account, target_account, options = {})
    @source_account = source_account
    @target_account = target_account
    @status_ids     = options.delete(:status_ids) || []
    @comment        = options.delete(:comment) || ''
    @options        = options

    create_report!
    forward_to_origin! if !@target_account.local? && ActiveModel::Type::Boolean.new.cast(@options[:forward])

    @report
  end

  private

  def create_report!
    @report = @source_account.reports.create!(
      target_account: @target_account,
      status_ids: @status_ids,
      comment: @comment,
      uri: @options[:uri]
    )
  end

  def forward_to_origin!
    ActivityPub::DeliveryWorker.perform_async(
      payload,
      some_local_account.id,
      @target_account.inbox_url
    )
  end

  def payload
    Oj.dump(ActiveModelSerializers::SerializableResource.new(
      @report,
      serializer: ActivityPub::FlagSerializer,
      adapter: ActivityPub::Adapter,
      account: some_local_account
    ).as_json)
  end

  def some_local_account
    @some_local_account ||= Account.representative
  end
end
