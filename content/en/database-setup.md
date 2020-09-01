---
title: Database Setup
description: How to install Postgres for a Rails application
position: 4
category: Getting started
---

## Install PostgreSQL

You can use MySQL or any other database. For this project, we will use Postgres; it is well-loved in the Rails community and has the most advantages IMO :)

Navigate to the [Postgres download](https://www.postgresql.org/download/) page and download the database to you operating system

On a Mac, I like using [Postgres.app](https://postgresapp.com/) for ease of setup

Start the postgres prompt to test correct installation

```bash
psql
```

## Install pgcli

[Pgcli](https://www.pgcli.com/) is a command line interface for Postgres with auto-completion and syntax highlighting - I really love it.

If you already know how to install python packages, then you can simply do

```
pip instal pgcli
```

On a Mac, it's easier to use Homebrew. Just be aware that this will install postgresql if you don't already have it.

```bash
brew tap dbcli/tap
brew install pgcli
```

Run pgcli to test installation

```bash
pgcli
```

## Environment variables

To avoid using commiting sensitive data to online communities such as Github, we are going to manage our environment variables with the [dotenv](https://github.com/bkeepers/dotenv) gem

Add it to your `Gemfile`

```ruby[Gemfile]
group :development, :test do
  ... # Using dots here to represent existing text
  gem 'dotenv-rails'
  ...
end
```

Create the `.env` file in the root dir and add it to your `.gitignore` file

```bash
touch .env && echo .env >> .gitignore
```

Add the env variables

```bash[.env]
POSTGRES_HOST=localhost
DEVELOPMENT_DB=graphql_on_rails_auth_development
TEST_DB=graphql_on_rails_auth_test
PRODUCTION_DB=graphql_on_rails_auth_production
```

Edit your `database.yml` to use the env variables

```ruby[database.yml]
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: <%= ENV['POSTGRES_HOST'] %>

development:
  <<: *default
  database: <%= ENV['DEVELOPMENT_DB'] %>

test:
  <<: *default
  database: <%= ENV['TEST_DB'] %>

production:
  <<: *default
  database: <%= ENV['PRODUCTION_DB'] %>
```

## Install dependencies

Run the following to install all dependencies inside `Gemfile` and to create the development and test databases

```bash
bin/setup
```

Check your database with pgcli

```bash
pgcli graphql_on_rails_auth_development
```

Go to [localhost:3000](localhost:3000) on your browser and reload

Did you say Yaay! :)
