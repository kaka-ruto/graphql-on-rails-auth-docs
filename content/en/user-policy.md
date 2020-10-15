---
title: User Policy
description: Authorizing API Requests
position: 34
category: Authorization
---

## ActionPolicy Policies

The core component of Action Policy is a policy class. Policy class describes how you control access to resources.

We will put policies into the `app/policies` folder (which we will create shortly)

On your terminal, run the following to create the `app/policies` folder and to create an `ApplicationPolicy` file with a global configuration with which all our policies will inherit from

```bash
bundle exec rails generate action_policy:install
```

## The User Policy

Let's create a user policy class with which to describe how users will access

1. Other users

2. Actions affecting other users

3. Actions affecting themselves

```bash
touch app/policies/user_policy_spec.rb && touch spec/policies/user_policy_spec.rb
```

## Add tests

Magic is about to happen!

Be sure to check the [testing docs](https://actionpolicy.evilmartians.io/#/testing) as our tests are going to be sweet and short.

```ruby[spec/policies/user_policy_spec.rb]
# frozen_string_literal: true

require 'action_policy/rspec/dsl'

RSpec.describe UserPolicy, type: :policy do
  let(:user) { build_stubbed :user }
  let(:unauthorized_user) { build_stubbed :user }
  let(:record) { user }

  describe_rule :show? do
    succeed 'when user is the current user' do
      let(:context) { { user: user } }
    end

    failed 'when user is not the current user' do
      let(:context) { { user: unauthorized_user } }
    end
  end

  describe_rule :update? do
    succeed 'when user is the current user' do
      let(:context) { { user: user } }
    end

    failed 'when user is not the current user' do
      let(:context) { { user: unauthorized_user } }
    end
  end

  describe_rule :destroy? do
    succeed 'when user is the current user' do
      let(:context) { { user: user } }
    end

    failed 'when user is not the current user' do
      let(:context) { { user: unauthorized_user } }
    end
  end
end
```

Hopefully the tests are self-explanatory and self describing!

The magic is brought by the action_policy domain specific language (DSL), which we have required on top of the file.

## Add the implementation

The functionality is equally short and sweet.

```ruby[app/policies/user_policy.rb]
# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def show?
    self?
  end

  def update?
    self?
  end

  def destroy?
    self?
  end

  private

  def self?
    record.id == user.id
  end
end
```

Our access control is simple now, especially since we do not have admins and we just want people to only access what they created, or, basically, their own selves :)

1. Before you view a certain user, we first check if you are 'yourself', as in you are trying to `show` or see your own account. If true, we allow you.

2. Before you update a certain user record, we also check if you are the owner of that account. If true, we allow you.

3. Before you destroy, or delete, a certain user record, we also check if you are the owner of that account. If true, we allow you.

## record vs user

What's the difference?

These two confused me initially. But I've got the answers now

- `record` represents the item you are trying to access. It can be `you` or another record entirely not associated with you

- `user` is the currently logged in user, the `context`, as GraphQL would put it.

For this policy class, we check that the given record's `id` is similar to the `id` of the current user.

If so, then we know you are the owner of the record you're trying to access, so we allow you!
