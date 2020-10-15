---
title: Update User Mutation
description: Mutation to update an existing user
position: 19
category: Mutations
---

## Register the mutation

Let us register the update mutation

```ruby[app/graphql/types/mutation_type.rb]
# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :update_user, mutation: Mutations::Users::Update
  end
end
```

## Add the tests

```ruby[spec/graphql/mutations/users/update_spec.rb]
# frozen_string_literal: true

RSpec.describe Mutations::Users::Update, type: :request do
  subject(:execute) do
    post graphql_path,
         params: { query: query_string, variables: variables }
  end

  let(:user) { create(:user) }

  describe '.resolve' do
    context 'valid params' do
      let(:variables) { { userId: user.id, email: 'arianna@email.com' } }

      it 'updates the user' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'updateUser')

        expect(data['user']).to include({ 'email' => 'arianna@email.com' })
        expect(data['errors']).to be_nil
      end
    end

    context 'invalid params' do
      let(:variables) { { userId: user.id, email: 'arianna' } }

      it 'returns an error message' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'updateUser')

        expect(data['errors']).to eq ['Email is invalid']
        expect(data['user']).to be_nil
      end
    end
  end

  def query_string
    <<~GRAPHQL
      mutation($userId: ID!, $email: String!) {
        updateUser(input: { userId: $userId, email: $email }) {
          user {
            firstName
            lastName
            email
          },
          errors
        }
      }
    GRAPHQL
  end
end
```

## Add the implementation

```ruby[app/graphql/mutations/users/update.rb]
# frozen_string_literal: true

class Mutations::Users::Update < Mutations::BaseMutation
  argument :user_id, ID, required: true
  argument :first_name, String, required: false
  argument :last_name, String, required: false
  argument :email, String, required: false

  field :user, Types::UserType, null: true
  field :errors, [String], null: true

  def resolve(user_id:, **args)
    user = ::Users::Show.call(id: user_id).user

    result = ::Users::Update.call(user: user, attributes: args)

    {
      user: result.user,
      errors: result.messages
    }
  end
end
```

To update a user, we require the `user_id`, and the `first_name`, `last_name` and `email` are optional

Our `Users::Show` and `Users::Update` interactors have come in very handy! They help us fetch the user, then update it.

We are then returning a hash containing a `user` object and an `errors` object

That's it!

Run the tests and watch them go green.
