---
title: Sign In Token
description: Generate token on sign in
position: 26
category: Authentication
---

## Sign In Token

When a user successfully signs in to our platform, we'd want to generate a token for them, with which they can proceed to access authenticated pages.

We will do this on the interactors as well.

## Add test

```ruby[spec/interactors/users/login_spec.rb]
module Users
  RSpec.describe Login, type: :interactor do
    context 'success' do

      ...
      it 'returns token' do
        expect(login.token).not_to be_nil
      end
    end
  end
end
```

## Generate the token on sign up

```ruby[app/interactors/users/login.rb]
    ...

    def call
      if user
        if user.authenticate(password)
          ...
          context.token = user.generate_token
        else
          ...
        end
      else
        ...
      end
    end
```

This way the token will always be returned when a user successfully signs in.
