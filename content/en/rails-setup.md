---
title: Rails Setup
description: How to install Rails
position: 3
category: Getting started
---

## Install Rails

Visit the [Rails docs](https://rubyonrails.org/) to check the latest Rails version

Install it

```bash
gem install rails -v 6.0.3.2
```

Or if you have an older version of rails and you'd like to update to the latest, run

```bash
gem update rails
```

Confirm your Rails version

```bash
rails -v
```

## Create a new Rails project

```bash
rails new graphql-on-rails-auth --api -d postgresql -T --skip-action-text --skip-spring --skip-turbolinks --skip-javascript --skip-webpack-install
```

<alert>

Here I have used the name `graphql-on-rails-auth` to match our [Github](https://github.com/kaka-ruto/graphql-on-rails-auth.git) repository. On the screencasts, you will find that I used the name `user-api`, let it not confuse you! (The screencasts came first :))

</alert>

We have skipped frameworks and libraries we don't need, chose Postgresql as our database, skipped Javascript as this is a purely backend system, skipped minitest (we will add RSpec)

Rails has a [new way](https://github.com/rails/rails/pull/39282) to skip most of these stuff. Opted not to use it because we will need some of the skipped frameworks there.

This is the new syntax for starting a new Rails project with minimal frameworks

```bash
rails new project-name --minimal
```

You can `cd` into your project directory and browse around the different files and folders created for you.

```bash
cd graphql-on-rails-auth
```

## Starting the Rails server

Run

```bash
bundle exec rails server
```

You will get an `ActiveRecord::NoDatabaseError` because we have not created any databases yet.

Let's fix this on the next section.
