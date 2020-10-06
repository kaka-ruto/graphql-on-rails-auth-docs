---
title: Show User
description: Query to fetch a user object
position: 14
category: Queries
---

## Definitions

Open the [queries docs](https://graphql-ruby.org/queries/executing_queries.html) page so we can go through this together

First, some definitions:

- Schema: A GraphQL schema describes the functionality available to the client applications that connect to the GraphQL server. We can use any programming language to create a GraphQL schema and build an interface around it.

- Query: A GraphQL query is used to read or fetch values from a GraphQL endpoint. It is a simple string that a GraphQL server can parse and respond to with data in JSON format

- Variables: Query variables are dynamic values that can be passed to a GraphQL query during execution

- Context: Application specific data passed onto resolver functions. The most common 'context' is the `context[:current_user]`

- Resolver: A query/mutation function that generates a response for a GraphQL query

NB: GraphQL has a single endpoint which always returns a JSON result.


## Fetch a single user

Let's create the relevant files and folders

```bash
mkdir app/graphql/queries && mkdir app/graphql/queries/users && mkdir spec/graphql/queries && mkdir spec/graphql/queries/users

touch app/graphql/queries/base_query.rb && touch app/graphql/queries/users/show.rb && spec/graphql/queries/users/show_spec.rb
```

Add the following to the `base_query`. The class is empty for now

```ruby[app/graphql/queries/base_query.rb]
# frozen_string_literal: true

module Queries
  class BaseQuery < GraphQL::Schema::Resolver
  end
end
```

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
