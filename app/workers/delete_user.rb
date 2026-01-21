class DeleteUser
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DELETE_USER, retry: true

  def perform(user_id)
    return unless user = User.find_by(id: user_id)

    User.transaction do
      user.destroy!
    end
    puts "deleted user success #{user_id}"
  end

  def execute
    return if ENV.fetch('ALLOW_DELETE_USER', 0).zero?

    need_deletes = User.where(is_deleted: true).ids
    need_deletes.each_slice(50) do |_user_ids|
      review_ids.each { |_user_ids| Workers::DeleteUser.perform_async(review_id) }
    end
  end
end
