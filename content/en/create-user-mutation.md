---
title: Create User Mutation
description: Mutation to create a new user
position: 18
category: Mutations
---

## Register the mutation

Like queries, GraphQL mutations all begin with the `field` keyword.

Let us register our first mutation


```ruby[app/graphql/types/mutation_type.rb]
# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for mutations on your schema.

    field :create_user, mutation: Mutations::Users::Create
  end
end
```

Now, whenever an incoming request uses the `mutation` keyword, it will go to `Types::MutationType`, which we specified on the schema

Once inside the `MutationType`, it finds the relevant mutation using the `field` keyword, then resolve to the right `mutation`

## Add the tests

As usual, let's first write the tests

```ruby[spec/graphql/mutations/users/create_spec.rb]
# frozen_string_literal: true

RSpec.describe Mutations::Users::Create, type: :request do
  describe '.resolve' do
    context 'valid params' do
      it 'creates a new user' do
        expect do
          post '/graphql', params: { query: query_string, variables: variables }
        end.to change(User, :count).by 1
      end

      it 'returns the user and a success message' do
        execute = post '/graphql', params: { query: query_string, variables: variables }

        parsed_json = JSON.parse(response.body)
        data = parsed_json['data']['createUser']

        expect(data['user']).to include(
          'fullName' => "#{variables[:firstName]} " + variables[:lastName].to_s,
          'email' => variables[:email]
        )
        expect(data['message']).not_to be_nil
      end
    end

    context 'invalid params' do
      it 'fails' do
        execute = post '/graphql', params: { query: query_string, variables: invalid_variables }

        parsed_json = JSON.parse(response.body)
        data = parsed_json['data']['createUser']

        expect(data['errors']).to eq ['Email is invalid', "Email can't be blank"]
        expect(data['user']).to be_nil
        expect(data['message']).to be_nil
      end
    end
  end

  def query_string
    <<~GRAPHQL
      mutation($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
        createUser(input: {
        firstName: $firstName, lastName: $lastName, email: $email, password: $password
        }) {
          user { firstName email },
          message,
          errors
        }
      }
    GRAPHQL
  end

  def variables
    {
      firstName: 'Mac',
      lastName: 'Andre',
      email: 'mac.andre@witz.com',
      password: '#2435$52736^836w'
    }
  end

  def invalid_variables
    {
      firstName: 'Mac',
      lastName: 'Andre',
      email: '',
      password: '#2435$52736^836w'
    }
  end
end
```

## Add the implementation

And now the implementation!

```ruby[app/graphql/mutations/users/create.rb]
# frozen_string_literal: true

class Mutations::Users::Create < Mutations::BaseMutation
  argument :first_name, String, required: true
  argument :last_name, String, required: true
  argument :email, String, required: true
  argument :password, String, required: true

  field :user, Types::UserType, null: true
  field :message, String, null: true
  field :errors, [String], null: true

  def resolve(**args)
    result = ::Users::Create.call(attributes: args)

    {
      user: result.user,
      message: result.message,
      errors: result.errors
    }
  end
end
```

The arguments are the inputs needed for this operation to be done. In RESTful Rails this would be the required `params`

The fields are what can be returned from this operation. So for this case we're saying return either, or any combination of a `user` object, a `message` object (ideally a success or failure message) or an `errors` array, which holds errors bubbled up by the application.

What we have defined here as fields basically mirrors what we have in the query string

```
{
  user { firstName email },
  message,
  errors
}
```

You would have also noted that our `resolver` method calls the `Users::Create` interactor, which grabs the passed arguments(args) and uses them to create/insert a new user to our database.

We are then returning a hash containing the 3 items, the user, message and errors. If any of them is nil, it just turns up as nil!

Run the test and watch it pass.

If you'd like to, place a `binding.pry` after the interactor is called and check the value for `result`
