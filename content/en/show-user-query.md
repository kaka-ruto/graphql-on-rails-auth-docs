---
title: Show User Query
description: Query to fetch a user object
position: 15
category: Queries
---

## Register the query

GraphQL queries all begin with the `field` keyword.

Let us register our first query


```ruby[app/graphql/types/query_type.rb]
# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :show_user, resolver: Queries::Users::Show
  end
end
```

Now, whenever an incoming request uses the `query` keyword, it will go to `Types::QueryType`, which we specified on the schema

Once inside the `QueryType`, it finds the relevant query using the `field` keyword, then resolve to the right `resolver`

## Add the tests

As usual, let's first write the tests

```ruby[spec/graphql/queries/users/show_spec.rb]
# frozen_string_literal: true

module Queries
  module Users
    RSpec.describe Show do
      subject(:execute) do
        GraphqlOnRailsSchema.execute(query, variables: variables, context: context)
      end

      let(:user) { create(:user) }
      let(:context) { { current_user: user } }
      let(:unauthorized_user) { create(:user) }

      describe '.resolve' do
        context 'authorized' do
          let(:variables) { { id: user.id } }

          it 'returns the user' do
            data = execute.dig('data', 'showUser')

            expect(data).to include(
              'email' => user.email, 'fullName' => "#{user.first_name} " + user.last_name.to_s
            )
          end
        end

        context 'unauthorized' do
          let(:variables) { { id: unauthorized_user.id } }

          it 'fails' do
            data = execute.dig('data', 'showUser')
            error_message =  execute.dig('errors').first['message']

            expect(data).to be_nil
            expect(error_message).to eq 'You are not authorized to perform this action'
          end
        end
      end

      private

      def query
        <<~GRAPHQL
          query($id: ID!) {
            showUser(id: $id) {
              email
              fullName
            }
          }
        GRAPHQL
      end
    end
  end
end
```

A lil' explanation:

Out test `subject` calls the `execute` action of the `GraphqlController` in `app/controllers/graphql_controller.rb`, passing to it the `query` string and `variables` (later on we will also pass the user `context`)

We have defined the query string as a method, but you can use whichever way, I have seen a number of people use RSpec's `let` but we'll stick to the method since I think it's cleaner.

The query string above uses the squiggly [heredoc](https://infinum.com/the-capsized-eight/multiline-strings-ruby-2-3-0-the-squiggly-heredoc) syntax

## Add the implementation

And now the implementation!

```ruby[app/graphql/queries/users/show.rb]
# frozen_string_literal: true

module Queries
  module Users
    class Show < Queries::BaseQuery
      argument :id, ID, required: true

      type Types::UserType, null: true

      def resolve(id:)
        result = ::Users::Get.call(id: id)

        result.user
      end
    end
  end
end
```

The ID argument is the input needed for this operation to be done.

The `type` is what can be returned from this operation. Which for this case we're saying return the `user` object and use the `UserType` to know what fields of the user object to return. Also, if the user is nil, return nil.

Our resolve method takes in a required argument called `id`, which comes from the `argument :id`.

It then calls the `Users::Show` interactor, which does the actual fetching of the user!

We then return `result.user` which contains the `user` object.

A few things to note:

- You can only have a singe `type` defined in a query class such as this

- You have to make sure the returned object matches your return `type` as defined, or nil if you have `null: true` specified

Run the tests and watch them pass!
