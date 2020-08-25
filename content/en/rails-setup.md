---
title: Rails Setup
description: How to setup a Rails API with GraphQL
position: 2
category: Getting started
---

Before we create the API, we will need to install Ruby, a Ruby version manager and Ruby on Rails.

<alert type="info">
*All the examples in this doc will assume you are on a Mac, unfortunately. Nevertheless, I will include links throughout to show how you can run the same commands on other operating systems
</alert>

## Install asdf-vm

You can use any Ruby version-manager, such as RVM or Rbenv. We will use [asdf-vm](https://asdf-vm.com) as it can manage multiple runtime versions(different programming languages).

<code-group>
  <code-block label="Brew" active>

  ```bash
  brew install asdf
  ```

</code-group>

Add the `asdf-ruby` plugin

```bash
asdf plugin add ruby
```

Install Ruby -v 2.6.5, or any that you'd like!

```bash
asdf install ruby 2.6.5
```



Pssst: More docs are coming!
