---
title: Login User Interactor
description: Interactor logic to login an existing user
position: 21
category: Sessions
---

## Sessions

In computer science, a session is a semi-permanent interactive information interchange between a computer and the user.

It is established at a certain time (for our case when a user logs in), and torn down at some later point(when the user logs out for example)

To log a user in, we will ask a non-logged in user to provide is with the `email` and `password` that they registered with. If the two are correct and match, we log them in and allow them to access authorised-only parts of our application.

First, let us write the tests for the business logic that will allow users to log a user in using the provided parameters.

## Login Interactor Tests

```ruby[spec/interactors/users/login_spec.rb]
# frozen_string_literal: true

RSpec.describe Users::Login, type: :interactor do
  subject(:login) do
    described_class.call(email: credentials[:email], password: credentials[:password])
  end

  let(:user) { create(:user) }

  describe '.call' do
    context 'success' do
      let(:credentials) do
        { email: user.email, password: user.password }
      end

      it 'passes context' do
        expect(login).to be_a_success
      end

      it 'returns a success message' do
        expect(login.message).to eq 'Successfully logged in'
      end

      it 'returns the user' do
        expect(login.user).to be_a User
      end
    end

    context 'wrong password' do
      let(:credentials) do
        { email: user.email, password: 'wrong password' }
      end

      it 'fails context' do
        expect(login).to be_a_failure
      end

      it 'returns a wrong password error message' do
        expect(login.message).to eq 'That seems like a wrong password'
      end
    end

    context 'user not found' do
      let(:credentials) do
        { email: 'one@two.com', password: user.password }
      end

      it 'fails context' do
        expect(login).to be_a_failure
      end

      it 'returns a user not found error message' do
        expect(login.message).to eq 'Could not find an account with that email, please sign up instead'
      end
    end
  end
end
```

And then it's implementation

## Login Interactor Logic

```ruby[app/interactors/users/login.rb]
# frozen_string_literal: true

class Users::Login < BaseInteractor
  delegate :email, :password, to: :context

  def call
    return nil if password.empty?

    user = User.find_by(email: email)

    if user
      if user.authenticate(password)
        context.message = 'Successfully logged in'
        context.user = user
      else
        context.fail! message: 'That seems like a wrong password'
      end
    else
      context.fail! message: 'Could not find an account with that email, please sign up instead'
    end
  end
end
```

We are finding the user by the email they have given us, if present, we compare the given password with the stored/hashed password using Bcrypt's `authenticate` method.

If all is well, we return a success message and the user object.

Later on, we will return a JWT token with which we will authenticate subsequent requests.
