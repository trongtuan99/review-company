class ReviewSerializer < BaseSerializer
  attributes :id, :title, :reviews_content, :score, :vote_for_quit, :vote_for_work,
             :is_anonymous, :user_id, :created_at, :updated_at, :company_id, :created_at_timestamp,
             :updated_at_timestamp, :total_like, :total_dislike, :total_reply, :user_like_status
  belongs_to :company, serializer: CompanySerializer

  def user_like_status
    return nil unless scope
    
    user_id = scope.respond_to?(:id) ? scope.id : scope
    return nil unless user_id
    
    like_record = object.likes.find_by(user_id: user_id)
    return nil unless like_record
    
    # Ensure we return a string, not a symbol
    # Rails enum returns the key as a string when serialized, but let's be explicit
    status_value = like_record.status
    return nil if status_value == 'default' || status_value == :default
    status_value.to_s
  end
end
