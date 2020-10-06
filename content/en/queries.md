---
title: Queries
description: What are GraphQL queries?
position: 13
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


## Create the files

Let's create the relevant files and folders, if they do not exist.

<alert>
If you used the install generator, `rails generate graphql:install`, a base query class will already have been generated for you. If that’s not the case, you should add a base class to your application
</alert>

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

Our queries must be attached to our schema using the `query(...)` configuration. Good thing is this is done only once.

Let's go ahead and add it


```ruby[app/graphql/graphql_on_rails_schema.rb]
# frozen_string_literal: true

class GraphqlOnRailsSchema < GraphQL::Schema
  query(Types::QueryType)
end
```
