---
title: Authorize User Query
description: Authorizing API Requests
position: 35
category: Authorization
---

## Authorizing User Query

Before a user sees another user, we'd first like to know if they are allowed to view that user.

If you remember from the user_policy we created a few moments ago, we only allow users to view their own accounts.

Otherwise we show them a 'You are not authorized' error message.


## Add tests

We had added tests before.

Let's add a test to validate that an unauthorized user trying to view another user get an error message that they are not allowed

```ruby[spec/graphql/queries/users/show_spec.rb]
# frozen_string_literal: true

module Queries
  module Users
    RSpec.describe Show do
      ...

      let(:unauthorized_user) { create(:user) }

      describe '.resolve' do
        ...

        context 'unauthorized' do
          let(:variables) { { id: unauthorized_user.id } }

          it 'fails' do
            data = execute.dig('data', 'showUser')
            error_message =  execute.dig('errors').first['message']

            expect(dta).to be_nil
            expect(error_message).to eq 'You are not authorized to perform this action'
          end
        end
      end

      ...
    end
  end
end
```

## Authorize the request

We will GraphQl Ruby's class-level authorization hooks `(self.authorized?)` inside our type classes.

The authorization hook will always run before the `resolve` method is called. Meaning we won't have to query the db if the use is not authorized.

We first check if they are authorized and if they are not, we immediately throw an error message and cancel the request.

You can read the ActionPolicy's [documentation](https://actionpolicy.evilmartians.io/#/graphql?id=class-level-authorization) on the same here.

Let's add the following to our user type class.

```ruby[app/graphql/types/user_type.rb]
module Types
  class UserType < Types::BaseObject
    ...
    def self.authorized?(object, context)
      super &&
        allowed_to?(
          :show?,
          object,
          context: { user: context[:current_user] }
        )
    end
  end
end
```

This will return `false` and halt the query/mutation if the user is not authorized, and `true` otherwise

## Return an error message

As it is at the moment, if the user is not authorized, it will just return a 'nil' user object and that's it, no error message.

To return an error message, let us add a top-level error by raising `GraphQL::ExecutionError` on our schema.

Note that you can do this on each of the `authorized?` methods you will add to your different types, but for our case I'd like to return a generic `You are not authorized to perform this action` error message.

So let's do that on our schema

```ruby[app/graphql/graphql_on_rails_schema.rb]
class GraphqlOnRailsSchema < GraphQL::Schema
  ...
  # When `authorized?` returns false for an object
  def self.unauthorized_object(_error)
    raise GraphQL::ExecutionError, 'You are not authorized to perform this action'
  end
  ...
end
```

Now users can only see/view their own accounts, otherwise they get an error message!
