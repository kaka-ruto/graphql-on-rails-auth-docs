---
title: Sign Up Token
description: Generate token on sign up
position: 26
category: Authentication
---

## Sign Up Token

When a user successfully signs up on our platform, we'd like to generate a token for them, with which they can proceed to access authenticated pages.

We will do this on the interactors, where rubber meets the road.

## Add test

```ruby[spec/interactors/users/create_spec.rb]
module Users
  RSpec.describe Create, type: :interactor do
    subject(:sign_up) { described_class.call(attributes: attributes) }

    context 'when given valid attributes' do
      let(:attributes) { { email: 'example@email.com', password: 'MyG00dPwd' } }

      it 'returns token' do
        expect(sign_up.token).not_to be_nil
      end
    end
  end
end
```

## Generate the token on sign up

```ruby[app/interactors/users/create.rb]
module Users
  class Create < BaseInteractor
    delegate :attributes, to: :context

    def call
      user = User.create(**attributes)

      if user.persisted?
        ...
        context.token = user.generate_token
      else
        ...
      end
    end
  end
end
```
