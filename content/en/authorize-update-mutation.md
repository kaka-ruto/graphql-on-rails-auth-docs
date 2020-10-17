---
title: Authorize Update Mutation
description: Authorizing API Requests
position: 36
category: Authorization
---

## Authorizing Update User Mutation

Before a user updates another user, we'd first like to know if they are allowed to update that user.

We only allow users to update their own accounts.


## Add tests

```ruby[spec/graphql/queries/users/update_spec.rb]
# frozen_string_literal: true

module Queries
  module Users
    RSpec.describe Update do
      ...

      let(:unauthorized_user) { create(:user) }

      describe '.resolve' do
        ...

        context 'unauthorized' do
          let(:variables) { { userId: unauthorized_user.id, email: 'arianna@email.com' } }

          it 'returns unauthorized status code' do
            execute

            json = JSON.parse(response.body)

            data = json.dig('data', 'updateUser')
            error_message = json.dig('errors').first['message']

            expect(data).to be_nil
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

I like using the class-level authorization hook `(self.authorized?)` which can be used in mutation classes as well.

But for this mutation, it will require us to pass to it the user id, which will then mean we have to fetch the user object again - meaning by the end of the operation, we will have had 2 GETs to the database, one for the hook and one for the resolver. not a good idea.

For this case therefore, we will use ActionPolicy's [authorize!](https://actionpolicy.evilmartians.io/#/graphql?id=authorizing-mutations) method

Let's add the following to our update user mutation

```ruby[app/graphql/mutations/users/update.rb]
class Mutations::Users::Update < Mutations::BaseMutation
  ...

  def resolve(user_id:, **args)
    user = ::Users::Get.call(id: user_id).user

    authorize! user, to: :update? if user

    result = ::Users::Update.call(user: user, attributes: args)

    {
      user: result.user,
      errors: result.messages
    }
  end
end
```

This will raise an `ActionPolicy::Unauthorized` exception and halt the query/mutation if the user is not authorized, and `true` otherwise

This exception is `rescued` from within our `schema` and a generic error message returned

Now users can only edit/update their own accounts, otherwise they get an error message!
