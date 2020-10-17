---
title: Authorize Delete Mutation
description: Authorizing API Requests
position: 37
category: Authorization
---

## Authorizing Delete User Mutation

Before a user deletes another user, we'd first like to know if they are allowed to delete that user.

We only allow users to delete their own accounts.


## Add tests

```ruby[spec/graphql/queries/users/delete_spec.rb]
# frozen_string_literal: true

module Queries
  module Users
    RSpec.describe Delete do
      ...

      let(:unauthorized_user) { create(:user) }

      describe '.resolve' do
        ...

        context 'unauthorized' do
          let(:variables) { { userId: unauthorized_user.id } }

          it 'returns error message' do
            execute

            json = JSON.parse(response.body)

            data = json.dig('data', 'deleteUser')
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

For this mutation as well, we will use the [authorize!](https://actionpolicy.evilmartians.io/#/graphql?id=authorizing-mutations) method for similar reasons as before

Let's add the following to our delete user mutation

```ruby[app/graphql/mutations/users/delete.rb]
class Mutations::Users::Delete < Mutations::BaseMutation
  ...

  def resolve(user_id:, **args)
    user = ::Users::Get.call(id: user_id).user

    authorize! user, to: :destroy? if user

    result = ::Users::Delete.call(user: user, attributes: args)

    {
      user: result.user,
      errors: result.messages
    }
  end
end
```

Now users can only destroy/delete their own accounts, otherwise they get an error message!
