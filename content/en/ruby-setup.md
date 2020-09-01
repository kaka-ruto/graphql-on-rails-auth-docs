---
title: Ruby Setup
description: How to install Ruby using ASDF
position: 2
category: Getting started
---

Before we create the API, we will need to install Ruby, a Ruby version manager and Ruby on Rails.

<alert type="info">
*All the examples in this doc will assume you are on a Mac. Nevertheless, I will include links throughout to show how you can run the same commands on other operating systems
</alert>

## Install Ruby

You can use any Ruby version-manager, such as RVM or Rbenv. We will use [asdf-vm](https://asdf-vm.com) as it can manage multiple runtime versions(different programming languages).

```bash
brew install asdf
```

Add the `asdf-ruby` plugin

```bash
asdf plugin add ruby
```

Install Ruby -v 2.6.5, or any that you'd like!

```bash
asdf install ruby 2.6.5
```

Confirm installed versions

```bash
asdf list ruby
```

Set current version

```bash
asdf global ruby 2.6.5  # This will set Ruby v2.6.5 as your default version 'everywhere'
asdf local ruby 2.6.5   # This will set Ruby v2.6.5 as your default version only for the current directory
```

View current version

```bash
asdf current
ruby -v
```

If you have problems setting your Ruby version even after installation, run

```bash
asdf reshim ruby
```
