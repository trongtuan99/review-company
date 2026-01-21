#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rake db:migrate
bundle exec rails runner db/seeds/common/0_seed_area.rb