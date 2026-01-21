require 'clockwork'
require './config/environment'

module Clockwork
  handler do |job, time|
    puts "Running #{job} at #{time}"
  end

  default_time                           = ENV.fetch('DEFAULT_CRONJOB_EXECUTE_TIME', '01:00')
  cronjob_time_to_destroy_company        = ENV.fetch('CRONJOB_TIME_TO_DESTROY_COMPANY', 1)
  cronjob_time_to_destroy_reivews        = ENV.fetch('CRONJOB_TIME_TO_DESTROY_REIVEWS', 60)
  cronjob_time_delete_user               = ENV.fetch('CRONJOB_TIME_TO_DELETEE_USER', 3)

  clock_mission = ->(mission, action, *args) { ClockMission.perform_async(mission, action, *args) }

  if ENV['ENABLE_DELETE_USER'].to_i.positive?
    log_msg = 'running delete user job'
    test_time = ENV.fetch('TEST_DELETE_USER_TIME', 1)

    if test_time.to_i.zero?
      every test_time.to_i.days, log_msg do
        clock_mission.call(DeleteUser, 'execute')
      end
    else
      every cronjob_time_delete_user.to_i.minutes, log_msg do
        clock_mission.call(DeleteUser, 'execute')
      end
    end
  end

  if ENV['ENABLE_FIND_AND_DESTROY_COMPANY'].to_i.positive?
    log_msg = 'running find and destroy company job'
    test_time = ENV.fetch('TEST_FIND_AND_DESTROY_COMPANY_TIME', 1)

    if test_time.to_i.zero?
      every test_time.to_i.minutes, log_msg do
        clock_mission.call(FindAndDestroyCompany, 'execute')
      end
    else
      every cronjob_time_to_destroy_company.to_i.day, log_msg do
        clock_mission.call(FindAndDestroyCompany, 'execute')
      end
    end
  end

  if ENV['ENABLE_FIND_AND_DESTROY_REVIEW'].to_i.positive?
    log_msg = 'running find and destroy reviews job'
    test_time = ENV.fetch('TEST_FIND_AND_DESTROY_REVIEWS_TIME', 1)

    if test_time.to_i.zero?
      every test_time.to_i.minutes, log_msg do
        clock_mission.call(FindAndDestroyReviews, 'execute')
      end
    else
      every cronjob_time_to_destroy_reivews.to_i.minutes, log_msg do
        clock_mission.call(FindAndDestroyReviews, 'execute')
      end
    end
  end
end
