---
title: Authorization with ActionPolicy
description: Authorizing API Requests
position: 33
category: Authorization
---

## ActionPolicy GraphQL

ActionPolicy has a really cool [graphql](https://github.com/palkan/action_policy-graphql) intergration.

This integration includes the following features:

- Fields & mutations authorization

- List and connections scoping

- Exposing permissions/authorization rules in the API.

It's been a game changer for me.

Really glad Palkan and team built this awesome tool for us.


## ActionPolicy Setup

Open the [documentation](https://actionpolicy.evilmartians.io/#/graphql) and let's rock this together

Add the gem to your Gemfile(in the general group - test, dev and prod) then run `bundle install`

```ruby[Gemfile]
gem "action_policy-graphql"
```

Then include `ActionPolicy::GraphQL::Behaviour` to our base type, base mutation and base query (and anywhere else you'd like to use authorization features)

```ruby
# For fields authorization, lists scoping and rules exposing
class Types::BaseObject < GraphQL::Schema::Object
  include ActionPolicy::GraphQL::Behaviour
end

# For using authorization helpers in mutations
class Types::BaseMutation < GraphQL::Schema::Mutation
  include ActionPolicy::GraphQL::Behaviour
end

# For using authorization helpers in resolvers
class Types::BaseQuery < GraphQL::Schema::Resolver
  include ActionPolicy::GraphQL::Behaviour
end
```

## Handling Authorization Exceptions

Exceptions will occur. Usesr will try accessing what they're not allowed to access, which would trigger, by default, a `ActionPolicy::Unauthorized` exception

Let's add the following to our schema for better handling of the exception, allowing us to send a more detailed error message to the client.

```ruby[app/graphql/graphql_on_rails_schema.rb]
class GraphqlOnRailsSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  ...
  use GraphQL::Execution::Errors    # Add this as well if you don't have it

  rescue_from(ActionPolicy::Unauthorized) do |err|
    raise GraphQL::ExecutionError.new(
      # use result.message (backed by i18n) as an error message
      err.result.message,
      # use GraphQL error extensions to provide more context
      extensions: {
        code: :unauthorized,
        fullMessages: err.result.reasons.full_messages,
        details: err.result.reasons.details
      }
    )
  end
end
```
