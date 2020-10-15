---
title: Encrypting Passwords
description: How to encrypt user passwords
position: 7
category: Business logic
---

## Secure Passwords

If you try to create a user at the moment, you will find that the passwords are stored in plain text!

This is a security threat

If anyone gets hold of your database somehow, they will read your users' passwords and you do not want that

Instead, it is common practice to hash confidential data like passwords

Ruby has a beautiful gem for hashing passwords, the [BCrypt](https://github.com/codahale/bcrypt-ruby). It is community-maintained and very secure.

It's already added to your Gemfile. Find the line and uncomment it

```ruby[Gemfile]
gem 'bcrypt' '~> 3.1.7'
```

Now add the bcrypt method `has_secure_password` to our user model

```ruby[app/model/user.rb]
class User < ApplicationRecord
  has_secure_password
  ...
end
```

We are not done yet.

`has_secure_password` adds methods to set and authenticate against a BCrypt password. This mechanism requires you to have a `xxx_digest` column in your user model/table, as specified in the documentation [here](https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html)

For our case, we need to rename our `password` column to `password_digest` in our user table.

Create a standalone Rails migration to update the column

```bash
rails g migration RenamePasswordToPasswordDigest
```

Open the migration file generated and edit it like so

```ruby[...rename_password_to_password_digest.rb]
class RenamePasswordToPasswordDigest < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :password, :password_digest
  end
end
```

Now run the migration

```bash
rails db:migrate
```

If you check your user table on pgcli, you'll find that now you have the `password_digest` attribute instead of `password`

<alert>
Once you've connected to your database on pgcli, use `\d users` to describe/show details of the users table
</alert>

If you now save a user to the db, you will find that the passwords (in the password_digest column), are hashed and therefore secure!

## Our first tests!

Let us test the presence, uniqueness and format of the email address when the user object is being created or updated

```ruby[spec/models/user_spec.rb]
RSpec.describe User, type: :model do
  it { should have_secure_password }
  it { should validate_presence_of :email }
  it { should validate_uniqueness_of :email }
  it { should allow_value('test@example.com').for :email }
  it { should not_to allow_value('test').for :email }
  it { should not_to allow_value('@example').for :email }
end
```

Run the tests with the following command on your terminal and see them turn red (fail) :)

```bash
rspec spec/models/user_spec.rb
```

Now let's make them green by adding the following to the user model

```ruby[app/models/user.rb]
class User < ApplicationRecord
  ...
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, presence: true, uniqueness: true
end
```

The email validator regex pattern `URI::MailTo::EMAIL_REGEXP` has since been built into Ruby as explained on this StackOverflow [answer](https://stackoverflow.com/questions/22993545/ruby-email-validation-with-regex/22994329).

It simply checks that the given email is actually an email address and not some random string

<alert>
What the email validator regex pattern doesn't do is to verify that the email actually exists. Such checks are advanced and the best way to validate it exists, and belongs to whomever gave it to us, is to send an actual email to the given email and ask the user to click a given link to confirm they own the address. That way you'll be sure the address not only exists, but that it also belongs to the user that submitted it. We'll hopefully cover this in upcoming docs and code!
</alert>

Rerun the tests and they should all pass!

```bash
rspec spec/models/user_spec.rb
```
