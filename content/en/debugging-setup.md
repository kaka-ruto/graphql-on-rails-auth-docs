---
title: Debugging Setup
description: How to setup debugging for a Rails application
position: 6
category: Getting started
---

## Pry

One of my best development tools, [pry](https://github.com/pry/pry) help you to find the specific line in your code that is causing an error in your application, helping you introspect your variables, methods, etc

[Pry-byebug](https://github.com/deivid-rodriguez/pry-byebug) gives you step-by-step debugging and stack navigation in Pry.

## Install Pry, Pry-byebug

Add them to your `Gemfile` and remember to `bundle install`!

```ruby[Gemfile]
group :development do
  ...
  gem 'pry-rails'
  gem 'pry-byebug'
  ...
end
```

```bash
bundle install
```

Once we start tracing errors, you'll see the power of pry!
