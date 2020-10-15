---
title: Authenticate Login Request
description: Authenticating login user request
position: 31
category: Authenticating Requests
---

## User Login

When an existing user signs in, we'd want to assign them a token with which they will be authenticated.

We've already generated the auth token in the login interactors.

All that's remaining is to return the token after a successful login request.

## Add tests

```ruby[spec/graphql/mutations/users/login_spec.rb]
RSpec.describe Mutations::Users::Login, type: :request do
  ...
  describe '.resolve' do
    context 'valid credentials' do
      ...
      it 'succeeds' do
        ...
        expect(data['token']).not_to be_nil
      end
    end

    context 'wrong password' do
      it 'fails' do
        ...
        expect(data['token']).to be_nil
      end
    end

    context 'email not found' do
      it 'fails' do
        ...
        expect(data['token']).to be_nil
      end
    end
  end

  def query_string
        <<~GRAPHQL
          mutation($email: String!, $password: String!) {
            loginUser(input: { email: $email, password: $password }) {
              user { email },
              message
              token
            }
          }
    GRAPHQL
  end
end
```

Note that we have modified our `query_string` as well, to return the token after the login request.

That means we will have to specify, on the login mutation, that the token is to be returned as well.


## Return the token type

```ruby[app/graphql/mutations/users/login.rb]
class Mutations::Users::Login < Mutations::BaseMutation
  ...
  field :token, String, null: true

  def resolve(email:, password:)
    ...
    result = ::Users::Login.call(email: email, password: password)

    {
      user: result.user,
      message: result.message,
      token: result.token
    }
  end
end
```

By specifying the `field :token`, we have specified that this mutation/request can return the `token` as a string.
