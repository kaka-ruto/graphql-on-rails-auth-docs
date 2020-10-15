---
title: The User Model
description: How to add a user model to a Rails application
position: 6
category: Business logic
---

## Create the user model

Create a user model(database table) with basic user attributes

```bash
rails g model user first_name:string lastname:string email:string:index password:string
```

`rails g` is short form for `rails generate`

We added an index to the `email` column because it is likely that we will be finding users by email. Indexing will help speed up the process

Open the created migration file inside the `db/migrations/` folder and edit it to look like so

```ruby[db/migrations/...create_users.rb]
class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email, null: false, default: ''
      t.string :password_digest, null: false, default: ''

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
```

Now run the migration by running the following on your terminal

```bash
rails db:migrate
```

This will create a new table in your test and development databases.

## Pgcli

You can check the newly created table on `pgcli`

```bash
pgcli graphql_on_rails_auth_development
```

The type `\dt` and enter to display tables

Type `\q` and enter to exit the pgcli session

## Annotate Models

Let us annotate our models for improved readability

Add the [gem](https://github.com/ctran/annotate_models) to your development group in the Gemfile


```ruby[Gemfile]
group :development do
  gem 'annotate'
end
```

Run `annotate` to annotate existing models.

Run `rails g annotate:install` to automatically annotate every time you run `db:migrate`, so you won't have to manually run `annotate` every time


## The User factory

It is the quality of your data that will help you avoid the sneaky and frustrating flaky tests - tests that pass this moment and fail another.

So let's clean up our user data for testing!

Edit your `spec/factories/users.rb` to look like the following:

```ruby[spec/factories/users.rb]
# frozen_string_literal: true

...
FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.email }
    password { Faker::Internet.password }
  end
end
```

Also notice that the annotate gem has given us useful schema information! You won't have to keep going to the `schema.rb` file for this info anymore
