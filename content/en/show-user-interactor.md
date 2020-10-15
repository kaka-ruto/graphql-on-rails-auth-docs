---
title: Show User Interactor
description: Interactor logic to show a user
position: 9
category: Business logic
---

## Show User Logic

Create the implementation and test files

```bash
touch app/interactors/users/show.rb && touch spec/interactors/users/show_spec.rb
```

## Test

Let's write the tests for the show user logic

```ruby[spec/interactors/users/show_spec.rb]
# frozen_string_literal: true

module Users
  RSpec.describe Get, type: :interactor do
    subject(:context) { described_class.call(id: id) }

    let(:user) { create(:user) }

    describe '.call' do
      context'when id is present' do
        let(:id) { user.id }

        it 'succeeds' do
          expect(context).to be_a_success
        end

        it 'returns the user' do
          expect(context.user).to be_a User
        end
      end

      context 'when id is not found' do
        let(:id) { 0 }
        let(:error_message) { ["Couldn't find User with 'id'=0"] }

        it 'fails' do
          expect(context).to be_a_failure
        end

        it 'returns an error message' do
          expect(context.messages).to eq error_message
        end
      end
    end
  end
end
```

## Run tests

Run the tests and watch them fail

```bash
rspec spec/interactors/users/show_spec.rb
```

And to run a single test

```bash
rspec spec/interactors/users/show_spec.rb:20
```

## Make The Tests Pass

This is how our logic for showing a user will look like

```ruby[app/interactors/users/show.rb]
# frozen_string_literal: true

module Users
  class Get < BaseInteractor
    delegate :id, to: :context

    def call
      context.user = User.find(id)
    rescue ActiveRecord::RecordNotFound => e
      context.fail! messages: [e.message]
    end
  end
end
```

Run all the tests again and verify everything works as expected.

Good job! :)
