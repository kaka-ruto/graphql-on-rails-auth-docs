---
title: GraphQL Ruby
description: Setting up GraphQL Ruby
position: 13
category: GraphQl
---

## Setup

GraphQL has been implemented in many languages.

In Ruby it's been implemented by the [graphql-ruby](https://graphql-ruby.org/) gem

[Graphiql](https://github.com/rmosolgo/graphiql-rails) is a GraphQL IDE that will let us peek into our sytem with it's handy documentation explorer, as well as give us an interface to test/run our queries and view the results

Let's add the two gems to the Gemfile and run `bundle install`

```ruby[Gemfile]
gem 'graphql'

group :development do
  gem 'graphiql-rails'
end
```

Run the following generator to generate for us the files, folders and code needed to have GraphQL running on our Rails API

```bash
rails generate graphql:install
```

Open and have a look at the generated files

While at it, let's mount the GraphiQL IDE engine to `routes.rb`

```ruby[config/routes.rb]
Rails.application.routes.draw do
  # ...
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/your/endpoint"
  end
end
```

Since we are in API mode, for us to render HTML on the GraphiQL IDE, lets do the following:

- Add `require 'sprockets/railtie'` to your `application.rb`

- Create a manifest file in `app/assets/config/manifest.js` and add the following

```js[app/assets/config/manifest.js]
//= link graphiql/rails/application.css
//= link graphiql/rails/application.js
```

- Restart the server(if it was already running) and visit [localhost:3000/graphiql](localhost:3000/graphiql) to see our IDE in action!
