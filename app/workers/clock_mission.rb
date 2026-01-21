class ClockMission
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CLOCK_MISSION, retry: false

  def initialize
    puts 'new clock missionr'
  end

  def perform mission, action, *args
    puts "Clock mission #{mission} - #{action}"
    puts "Params: \t#{args}" unless args.empty?

    if action == 'perform_async'
      mission.to_s.constantize.send(action, *args)
    else
      mission.to_s.constantize.new.send(action, *args)
    end
  end
end
