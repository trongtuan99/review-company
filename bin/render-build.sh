#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rake db:migrate

# Run essential seeds
echo "Seeding Areas..."
bundle exec rails runner db/seeds/common/0_seed_area.rb

echo "Seeding Roles..."
bundle exec rails runner db/seeds/common/3_seed_role.rb

echo "Seeds completed!"