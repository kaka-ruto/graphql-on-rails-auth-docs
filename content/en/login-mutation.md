---
title: Login User Mutation
description: Mutation to login an existing user
position: 21
category: Sessions
---

## Register the mutation

The login mutation will call the login interactor and pass to it the creadentials needed to log in a user - email and password.

Let us go ahead and register it.

```ruby[app/graphql/types/mutation_type.rb]
# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :login_user, mutation: Mutations::Users::Login
  end
end
```

## Add the tests

```ruby[spec/graphql/mutations/users/login_spec.rb]
# frozen_string_literal: true

RSpec.describe Mutations::Users::Login, type: :request do
  subject(:execute) do
    post graphql_path, params: { query: query_string, variables: variables }
  end

  let(:user) { create(:user) }

  describe '.resolve' do
    context 'valid credentials' do
      let(:variables) { { email: user.email, password: user.password } }

      it 'succeeds' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'loginUser')

        expect(data['user']).not_to be_empty
        expect(data['message']).to eq 'Successfully logged in'
      end
    end

    context 'wrong password' do
      let(:variables) { { email: user.email, password: 'wrong password' } }

      it 'fails' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'loginUser')

        expect(data['message']).to eq 'That seems like a wrong password'
        expect(data['user']).to be_nil
      end
    end

    context 'email not found' do
      let(:variables) { { email: 'arianna@ari.com', password: user.password } }

      it 'fails' do
        execute

        json = JSON.parse(response.body)
        data = json.dig('data', 'loginUser')

        expect(data['message']).to eq 'Could not find an account with that email, please sign up instead'
        expect(data['user']).to be_nil
      end
    end
  end

  def query_string
    <<~GRAPHQL
      mutation($email: String!, $password: String!) {
        loginUser(input: { email: $email, password: $password }) {
          user { email },
          message
        }
      }
    GRAPHQL
  end
end
```

## Add the implementation

```ruby[app/graphql/mutations/users/login.rb]
# frozen_string_literal: true

class Mutations::Users::Login < Mutations::BaseMutation
  argument :email, String, required: true
  argument :password, String, required: true

  field :user, Types::UserType, null: true
  field :message, String, null: true

  def resolve(email:, password:)
    return unless email && password

    result = ::Users::Login.call(email: email, password: password)

    {
      user: result.user,
      message: result.message,
    }
  end
end
```

The resolve method takes in an email address and password, with which we will the `Users::Login` interactor.

We are then returning a hash containing a `message` string and the logged in `user` object

Run the tests.
