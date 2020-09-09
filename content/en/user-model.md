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

## Annotate

Let us annotate our models for improved readability

Add the [gem](https://github.com/ctran/annotate_models) to your development group in the Gemfile


```ruby[Gemfile]
group :development do
  gem 'annotate'
end
```

Run `annotate` to annotate exiting models.

Run `rails g annotate:install` to automatically annotate every time you run `db:migrate`, so you won't have to manually run `annotate` every time

## Our first tests!

Let us test the presence, uniqueness and format of the email address when the user object is being created or updated

```ruby[spec/models/user_spec.rb]
RSpec.describe User, type: :model do
  it { is_expected.to validate_presence_of :email }
  it { is_expected.to validate_uniqueness_of :email }
  it { is_expected.to allow_value('test@example.com').for :email }
  it { is_expected.not_to allow_value('test').for :email }
  it { is_expected.not_to allow_value('@example').for :email }
end
```

Run the tests with the following command on your terminal and see them turn red (fail) :)

```bash
rspec spec/models/user_spec.rb
```

Now let's make them green by adding the following to the user model

```ruby[app/models/user.rb]
validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, presence: true, uniqueness: true
```

Rerun the tests and they should all pass!
