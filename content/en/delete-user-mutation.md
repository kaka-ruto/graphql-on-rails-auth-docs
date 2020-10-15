---
title: Delete User Mutation
description: Mutation to delete an existing user
position: 20
category: Mutations
---

## Register the mutation

Let us register the delete mutation

```ruby[app/graphql/types/mutation_type.rb]
# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :delete_user, mutation: Mutations::Users::Delete
  end
end
```

## Add the tests

```ruby[spec/graphql/mutations/users/delete_spec.rb]
# frozen_string_literal: true

RSpec.describe Mutations::Users::Delete, type: :request do
  subject(:execute) do
    post graphql_path,
         params: { query: query_string, variables: variables }
  end

  let(:user) { create(:user) }

  describe '.resolve' do
    let(:variables) { { userId: user.id } }

    context 'valid params' do

      it 'deletes the user' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'deleteUser')

        expect(data['message']).to eq 'You have successfully deleted your account'
        expect(data['errors']).to be_nil
      end
    end

    context 'when it fails' do
      let(:error_message) { ['Your account could not be deleted at this time'] }
      let(:result) { Interactor::Context.new(errors: error_message) }

      before do
        allow(::Users::Delete).to receive(:call)
          .with(user: user)
          .and_return(result)

        allow(result).to receive(:success?).and_return(false)
        allow(result).to receive(:failure?).and_return(true)
      end

      it 'does not delete the user' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'deleteUser')

        expect(data['message']).to be_nil
        expect(data['errors']).to eq error_message
      end
    end
  end

  def query_string
    <<~GRAPHQL
      mutation($userId: ID!) {
        deleteUser(input: { userId: $userId }) {
          message
          errors
        }
      }
    GRAPHQL
  end
end
```

## Add the implementation

```ruby[app/graphql/mutations/users/delete.rb]
# frozen_string_literal: true

class Mutations::Users::Delete < Mutations::BaseMutation
  argument :user_id, ID, required: true

  field :message, String, null: true
  field :errors, [String], null: true

  def resolve(user_id:)
    user = ::Users::Show.call(id: user_id).user

    result = ::Users::Delete.call(user: user)

    {
      message: result.message
      errors: result.messages
    }
  end
end
```

To delete a user, we require the `user_id` only
We then use the `Users::Show` interactor to find the user and `Users::Delete` interactor to delete the record from our db.

We are then returning a hash containing a `message` string and an `errors` object if any errors occur during the operation

That's it!

Run the tests and watch them go green.
