---
title: Mutations
description: What are GraphQL Mutations?
position: 17
category: Mutations
---

## Definitions

As is our norm, open the [mutation docs](https://graphql-ruby.org/mutations/mutation_root.html) and let's clear some few questions you might have

- Whereas GraphQL queries are used for fetching/reading data, GraphQL mutations are used to change/write/update/modify data.

For example, mutation fields may create, update or destroy records in the database

Like all GraphQL fields, mutation fields:

- Accept inputs, called arguments

- Return values via fields


## Create the files

Let's create the relevant files and folders, if they do not exist.

<alert>
If you used the install generator, `rails generate graphql:install`, a base mutation class will already have been generated for you. If that’s not the case, you should add a base class to your application
</alert>

```bash
mkdir app/graphql/mutations && mkdir app/graphql/mutations/users && mkdir spec/graphql/mutations && mkdir spec/graphql/mutations/users

touch app/graphql/mutations/base_mutation.rb && touch app/graphql/mutations/users/show.rb && spec/graphql/mutations/users/show_spec.rb
```

The `base_mutation` will look like so

```ruby[app/graphql/mutationss/base_mutation.rb]
# frozen_string_literal: true

module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject
  end
end
```

Our mutations must be attached to our schema using the `mutation(...)` configuration. Good thing is this is done only once.

Let's go ahead and add it


```ruby[app/graphql/graphql_on_rails_schema.rb]
# frozen_string_literal: true

class GraphqlOnRailsSchema < GraphQL::Schema
  mutation(Types::MutationType)
end
```
