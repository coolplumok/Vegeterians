# frozen_string_literal: true

class Api::V1::MediaController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write, :'write:media' }
  before_action :require_user!

  include ObfuscateFilename
  obfuscate_filename :file

  respond_to :json

  def create
    @media = current_account.media_attachments.create!(account: current_account, file: media_params[:file], description: media_params[:description], focus: media_params[:focus])
    render json: @media, serializer: REST::MediaAttachmentSerializer
  rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    render json: file_type_error, status: 422
  rescue Paperclip::Error
    render json: processing_error, status: 500
  end

  def update
    @media = current_account.media_attachments.find(params[:id])
    @media.update!(media_params)
    render json: @media, serializer: REST::MediaAttachmentSerializer
  end

  private

  def media_params
    params.permit(:file, :thumbnail, :description, :focus)
  end

  def file_type_error
    { error: 'File type of uploaded media could not be verified' }
  end

  def processing_error
    { error: 'Error processing thumbnail for uploaded media' }
  end
end
