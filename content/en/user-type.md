---
title: User Type
description: Creating the user type object in GraphQL
position: 14
category: Queries
---

## Objects

GraphQl object types are the most basic components of a GraphQL schema.

They represent a kind of object you can fetch from your service, and what fields/attributes it has, thus, forming the GraphQL type system which describes what data can be queried.

Generally speaking, GraphQL object types correspond to models in your application, like `User`.


## The User Type

Let us define the user type. This involves stating what fields/attributes the `User` object has.

We can manually create them or use the handy graphql-ruby generator

```bash
rails g graphql:object User email:String firstName:String lastName:String
```

This will create a `app/graphql/types/user_type.rb` file, it should look like so

```ruby[app/graphql/types/user_type.rb]
# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :first_name, String, null: false
    field :last_name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
```

Now let's write our first query!
