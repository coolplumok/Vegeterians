# frozen_string_literal: true

require_relative '../../config/boot'
require_relative '../../config/environment'
require_relative 'cli_helper'

module GabSocial
  class MediaCLI < Thor
    include ActionView::Helpers::NumberHelper

    def self.exit_on_failure?
      true
    end

    option :days, type: :numeric, default: 7
    option :background, type: :boolean, default: false
    option :verbose, type: :boolean, default: false
    option :dry_run, type: :boolean, default: false
    desc 'remove', 'Remove remote media files'
    long_desc <<-DESC
      Removes locally cached copies of media attachments from other servers.

      The --days option specifies how old media attachments have to be before
      they are removed. It defaults to 7 days.

      With the --background option, instead of deleting the files sequentially,
      they will be queued into Sidekiq and the command will exit as soon as
      possible. In Sidekiq they will be processed with higher concurrency, but
      it may impact other operations of the Vegeterians.live server, and it may overload
      the underlying file storage.

      With the --dry-run option, no work will be done.

      With the --verbose option, when media attachments are processed sequentially in the
      foreground, the IDs of the media attachments will be printed.
    DESC
    def remove
      time_ago  = options[:days].days.ago
      queued    = 0
      processed = 0
      size      = 0
      dry_run   = options[:dry_run] ? '(DRY RUN)' : ''

      if options[:background]
        MediaAttachment.where.not(remote_url: '').where.not(file_file_name: nil).where('created_at < ?', time_ago).select(:id, :file_file_size).reorder(nil).find_in_batches do |media_attachments|
          queued += media_attachments.size
          size   += media_attachments.reduce(0) { |sum, m| sum + (m.file_file_size || 0) }
          Maintenance::UncacheMediaWorker.push_bulk(media_attachments.map(&:id)) unless options[:dry_run]
        end
      else
        MediaAttachment.where.not(remote_url: '').where.not(file_file_name: nil).where('created_at < ?', time_ago).reorder(nil).find_in_batches do |media_attachments|
          media_attachments.each do |m|
            size += m.file_file_size || 0
            Maintenance::UncacheMediaWorker.new.perform(m) unless options[:dry_run]
            options[:verbose] ? say(m.id) : say('.', :green, false)
            processed += 1
          end
        end
      end

      say

      if options[:background]
        say("Scheduled the deletion of #{queued} media attachments (approx. #{number_to_human_size(size)}) #{dry_run}", :green, true)
      else
        say("Removed #{processed} media attachments (approx. #{number_to_human_size(size)}) #{dry_run}", :green, true)
      end
    end
  end
end
