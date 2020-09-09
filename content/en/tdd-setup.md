---
title: TDD Setup
description: How to setup TDD in a Rails application
position: 5
category: Getting started
---

## TDD?

TDD stands for Test Driven Development, literally meaning you let tests drive/dictate your development.

Before you add a feature, add a test for that feature first, watch the test fail, then write the implementation to make it pass.

Honestly, I can say that [TDD changed my life](https://medium.com/javascript-scene/tdd-changed-my-life-5af0ce099f80). Recommended read! Article by Eric Elliott, a strong TDD proponent like me :)

## Install testing gems

[RSpec](https://github.com/rspec/rspec-rails) is a loved testing framework in the Rails community. The Rails core team prefers [Minitest](https://github.com/seattlerb/minitest), which is still a good one!

We will use RSpec.

[shoulda-matchers](https://github.com/thoughtbot/shoulda-matchers) adds simple one-liner tests for common Rails functionality

[FactoryBot](https://github.com/thoughtbot/factory_bot_rails) will help us write fixtures for our tests.

[Faker](https://github.com/faker-ruby/faker) will help us generate fake test data, such as names, addresses, etc. You don't have to keep quessing :)

[Database-cleaner](https://github.com/DatabaseCleaner/database_cleaner) will ensure each of our tests run on a clean state every time they are run. This will help prevent conflicts in the tests

[Rubocop](https://github.com/rubocop-hq/rubocop-rails) will enforce Rails' best practices on your codebase.

Add the gems to your `Gemfile` and run `bundle install` to install them


```ruby[Gemfile]
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  # Let us use the master version of Faker to get the latest but unreleased changes. We like living on the edge too :)
  gem 'faker', :git => 'https://github.com/faker-ruby/faker.git', :branch => 'master'
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false
end
```

```ruby[Gemfile]
group :test do
  gem 'shoulda-matchers', '~> 4.0'
  gem 'database_cleaner'
end
```

```bash
bundle install
```

## Setup RSpec

Run the rspec:install generator

```bash
bundle exec rails generate rspec:install
```

Edit the generated `.rspec` file to some defaults

```bash[.rspec]
--require rails_helper
--color
--format documentation
```

## Setup shoulda-matchers

```
mkdir spec/support && touch spec/support/shoulda_matchers.rb
```

This is a common operation - creating a folder and files in it. To reduce the typing, I made a handy script and called it [mkfile](https://github.com/kaka-ruto/dotfiles/blob/master/zsh/functions/mkfile). It creates the directory if it doesn't exist, and even adds it to git!

Optional: you can copy it to your own `mkfile` file and use it like so

```bash
mkfile spec/support/shoulda_matchers.rb
```

Configure RSpec to use shoulda-matchers

```ruby[spec/support/shoulda_matchers.rb]
# frozen_string_literal: true

require 'shoulda/matchers'

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
```

## Setup FactoryBot

```bash
touch spec/support/factory_bot.rb
```

Configure your test suites to include FactoryBot methods

```ruby[spec/support/factory_bot.rb]
# frozen_string_literal: true

require 'factory_bot_rails'

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
```

## Setup database_cleaner

Create the support file

```bash
touch spec/support/database_cleaner.rb
```

Configure it for RSpec

```ruby[spec/support/database_cleaner.rb]
# frozen_string_literal: true

require 'database_cleaner'

RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.around do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end
end
```

## Setup Rubocop

Create the Rubocop configuration file

```bash
touch .rubocop.yml
```

Add a few custom rules for our API

```ruby[.rubocop.yml]
require:
  - rubocop-rails
  - rubocop-rspec

AllCops:
  Exclude:
    - db/**/*

Layout/LineLength:
  Max: 100

Metrics/BlockLength:
  Exclude:
    - config/**/*
    - spec/**/*

Lint/AmbiguousBlockAssociation:
  Exclude:
    - spec/**/*

Style/Documentation:
  Enabled: false

RSpec/ImplicitExpect:
  EnforcedStyle: should
```
