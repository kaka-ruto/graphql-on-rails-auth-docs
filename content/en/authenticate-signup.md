---
title: Authenticate Signup Request
description: Authenticating create user request
position: 29
category: Authenticating Requests
---

## User Creation

After a user is created, we'd want to return the token.

We've already generated the auth token in the interactors.

All that's remaining is to return the token after those requests.

## Add tests

```ruby[spec/graphql/mutations/users/create_spec.rb]
RSpec.describe Mutations::Users::Create, type: :request do
  describe '.resolve' do
    context 'valid params' do
      ...
      it 'returns the user token, and success message' do
        execute = post '/graphql', params: { query: query_string, variables: variables }

        parsed_json = JSON.parse(response.body)
        data = parsed_json['data']['createUser']

        ...
        expect(data['token']).not_to be_nil
      end
    end

    context 'invalid params' do
      it 'fails' do
        execute = post '/graphql', params: { query: query_string, variables: invalid_variables }

        parsed_json = JSON.parse(response.body)
        data = parsed_json['data']['createUser']

        ...
        expect(data['token']).to be_nil
      end
    end
  end

  def query_string
    <<~GRAPHQL
      mutation($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
        createUser(input: {
        firstName: $firstName, lastName: $lastName, email: $email, password: $password
        }) {
          user { fullName email },
          message,
          token,
          errors
        }
      }
    GRAPHQL
  end
  ...
end
```

Note that we have modified our `query_string` as well, to return the token after the creation request.

That means we will have to specify, on the create mutation, that the token is to be returned as well.


## Return the token type

```ruby[app/graphql/mutations/users/create.rb]
class Mutations::Users::Create < Mutations::BaseMutation
  ...
  field :token, String, null: true

  def resolve(**args)
    result = ::Users::Create.call(attributes: args)

    {
      user: result.user,
      message: result.message,
      token: result.token,
      errors: result.errors
    }
  end
end
```

See how we're specifying the `field :token`?

We're basically 'declaring' that this mutation/request can return the `token` as a string.

Then we go ahead to assign it to the token gotten from calling the create user interactor!
