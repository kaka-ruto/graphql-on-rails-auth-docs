---
title: Setting up JWT
description: Authenticating Users using JWTs
position: 24
category: Authentication
---

## Install JWT

On the Gemfile uncomment the JWT line

```ruby[Gemfile]
gem 'jwt'
```

Run `bundle install`


## Add a test for the method that generates the token

Since the token is for authenticating users, we will generate it on the user model

We will add a method call `generate_token`, which will use our app's `secret_key_base` as the key to generate a token with a 30 day expiry period.

I think that is enough info to write a test? Let's go ahead.

```ruby[spec/models/user-spec.rb]
RSpec.describe User, type: :model do
  include ActiveSupport::Testing::TimeHelpers

  describe '.generate_token' do
    let(:user) { build_stubbed(:user) }
    let(:key) { Rails.application.secrets.secret_key_base }

    it 'returns a JWT with valid claims' do
      token = user.generate_token

      claims = JWT.decode(token, key).first
      freeze_time

      expect(claims['id']).to eq user.id
      expect(claims['exp']).to eq 30.days.from_now.to_i
    end
  end
end
```

We included the timehelpers so that we can use `freeze_time` to, you got it, freeze time. This way we can assert the 30 day expiry period.

## Generate the token

```ruby[app/models/user.rb]
class User < ApplicationRecord

  def generate_token
    payload = { id: id, exp: 30.days.from_now.to_i }
    hmac_secret = Rails.application.secrets.secret_key_base

    JWT.encode(payload, hmac_secret)
  end
end
```
