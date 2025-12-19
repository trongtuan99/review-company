# frozen_string_literal: true

# Karafka consumer for like_event topic
class LikeEventConsumer < ApplicationConsumer
  def consume
    messages.each do |message|
      like_payload = JSON.parse(message.payload)
      
      # Log message
      Rails.logger.info "Received like event: #{like_payload.inspect}"
      
      # Send to Sidekiq worker
      Workers::HandleLikeEvent.perform_async(like_payload)
    end
  end
end

