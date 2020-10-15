---
title: Create User Interactor
description: Interactor logic to create a new user
position: 8
category: Business logic
---

## The Interactor Gem

  I bet you've heard of the thin controllers vs fat models(or is it the opposite?) war somewhere on the internet.

Well, this isn't it, but the [interactor](https://github.com/collectiveidea/interactor) gem takes logic out of both models and controllers.

Yes it is like service objects, but it provides more than service objects provide.

And it's most powerful feature, IMO, which service objects don't have, is the `context`. You will see in a few what I'm talking about

Another one? Organizers. An organizer's single job is to run other interactors.

If any one of the organized interactors fails its context, the organizer stops and subsequent interactors will not be called.

Checkout the documentation above for more!

## Create User Logic

Let's add [interactor-rails](https://github.com/collectiveidea/interactor-rails) into our Gemfile and run bundle install

```ruby[Gemfile]
...
gem 'interactor-rails'
...
```

```bash
bundle install
```

Create the relevant folders and files

```bash
mkdir app/interactors && mkdir app/interactors/users
mkdir spec/interactors && mkdir spec/interactors/users
touch app/interactors/base_interactor.rb
touch app/interactors/users/create.rb && touch spec/interactors/users/create_spec.rb
```

All other interactors will inherit from the `base_interactor`

Add the following to the file

```ruby[app/interactors/base_interactor.rb]
# frozen_string_literal: true

class BaseInteractor
  include Interactor
end
```

## Tests

<alert>
Since this is just documentation, it is hard to demonstrate the real power (and effectiveness) of using a tests first approach.
</alert>

For this case, I will be sharing chunks of tests (as it makes sense), as well as their implementation.

Otherwise the ideal way when following a TDD approach, is to first write a single test (which could be a line of code), run that test and watch it fail, then write the implementation to make just that single test to pass, rerun the single test and watch it pass, then refactor if need be.

You can see me demonstrate this tests first approach in the screencasts

Let's write the tests for the create user logic

```ruby[spec/interactors/users/create_spec.rb]
# frozen_string_literal: true

module Users
  RSpec.describe Create, type: :interactor do
    subject(:sign_up) { described_class.call(attributes: attributes) }

    describe '.call' do
      context 'when given valid attributes' do
        let(:attributes) { { email: 'example@email.com', password: 'MyG00dPwd' } }

        it 'succeeds' do
          expect(sign_up).to be_a_success
        end

        it 'returns user' do
          expect(sign_up.user).to be_a User
        end

        it 'returns success message' do
          expect(sign_up.message).to eq 'You have successfully signed up'
        end
      end

      context 'when given invalid attributes' do
        let(:attributes) { { email: 'example@email.com', password: '' } }

        it 'fails' do
          expect(sign_up).to be_a_failure
        end

        it 'returns a failure message' do
          expect(sign_up.errors).to eq ["Password can't be blank"]
        end

        it 'returns nil user' do
          expect(sign_up.user).to eq nil
        end
      end
    end
  end
end
```

## Run All Tests

Run the tests and watch them fail

```bash
rspec spec/interactors/users/create_spec.rb
```

## Run a Single Test

To run a single test at a time, simply append a `:line_number` at the end of the command to run tests on a file. I.e the following will run only the test on line 20 of the `create_spec.rb` test file

```bash
rspec spec/interactors/users/create_spec.rb:20
```

## Make The Tests Pass

This is how our logic for creating users will look like

```ruby[app/interactors/users/create.rb]
# frozen_string_literal: true

module Users
  class Create < BaseInteractor
    delegate :attributes, to: :context

    def call
      user = User.create(**attributes)

      if user.persisted?
        context.user = user
        context.message = 'You have successfully signed up'
      else
        context.fail! errors: user.errors.full_messages, user: nil
      end
    end
  end
end
```

Brief explanation.

Interactors primarily have one public method, `call`.

This is where we put our single-purpose logic.

This method expects a hash object called `attributes`, which, for this case, will hold all our user data such as `first_name`, `last_name`, `email` and `password`

We then create the user using those passed attributes, then check whether the user was persisted?

If so, we return the `context` object with it the newly created `user` object and a `message`

If the user is not persisted for some reason, then we `fail!` the context and return an `errors` object with the `full_messages` of the errors that occurred

This is pretty much how all our interactors will look like
  - Perform some database-involving action
  - Check if that action succeeded
  - If the action succeeded, return the object value and a success message
  - If the action failed, return the object as nil and a failure message
