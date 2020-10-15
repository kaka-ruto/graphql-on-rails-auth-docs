---
title: Update User Interactor
description: Interactor logic to update a user
position: 10
category: Business logic
---

## Update User Logic

Create the implementation and test files

```bash
touch app/interactors/users/update.rb && touch spec/interactors/users/update_spec.rb
```

## Test

Let's write the tests for the update user logic

```ruby[spec/interactors/users/update_spec.rb]
# frozen_string_literal: true

module Users
  RSpec.describe Update, type: :interactor do
    subject(:context) { described_class.call(user: user, attributes: attributes) }

    let(:user) { create(:user) }

    context 'when attributes are valid' do
      let(:attributes) { { first_name: 'Imani', last_name: 'Alpha' } }

      it 'succeeds' do
        expect(context).to be_a_success
      end

      it 'updates the user' do
        expect { context; user.reload }.to change(user, :first_name).to attributes[:first_name]
      end

      it 'returns the user' do
        expect(context.user).to be_a User
      end
    end

    context 'when attributes are invalid' do
      let(:attributes) { { email: '@email.com' } }
      let(:error_message) { ['Email is invalid'] }

      it 'fails' do
        expect(context).to be_a_failure
      end

      it 'returns an error message' do
        expect(context.messages).to eq error_message
      end

      it 'returns nil user' do
        expect(context.user).to be_nil
      end
    end
  end
end
```

## Run tests

Run the tests and watch them fail

```bash
rspec spec/interactors/users/update_spec.rb
```

And to run a single test

```bash
rspec spec/interactors/users/update_spec.rb:20
```

## Make The Tests Pass

This is how our logic for updating a user will look like

```ruby[app/interactors/users/update.rb]
# frozen_string_literal: true

module Users
  class Update < BaseInteractor
    delegate :user, :attributes, to: :context

    def call
      if user.update attributes
        context.user = user
      else
        context.fail! messages: user.errors.full_messages, user: nil
      end
    end
  end
end
```

Run all the tests again and verify everything works as expected.
