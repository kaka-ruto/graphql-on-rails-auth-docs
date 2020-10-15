---
title: Delete User Interactor
description: Interactor logic to delete a user
position: 11
category: Business logic
---

## Delete User Logic

Create the implementation and test files

```bash
touch app/interactors/users/delete.rb && touch spec/interactors/users/delete_spec.rb
```

## Test

Let's write the tests for the delete user logic

```ruby[spec/interactors/users/delete_spec.rb]
# frozen_string_literal: true

module Users
  RSpec.describe Delete, type: :interactor do
    subject(:context) { described_class.call(user: user) }

    let(:user) { create(:user) }

    describe '.call' do
      context 'when successful' do
        it 'passes' do
          expect(context).to be_a_success
        end

        it 'deletes the user record' do
          context

          expect(user.destroyed?).to eq true
        end

        it 'returns a success message' do
          context

          expect(context.message).to eq 'You have successfully deleted your account'
        end
      end

      context 'when it fails' do
        let(:error_message) { 'Record Not Destroyed' }

        before do
          allow(user).to receive(:destroy!).and_raise ActiveRecord::RecordNotDestroyed.new error_message
        end

        it 'fails' do
          expect(context).to be_a_failure
        end

        it 'does not delete the user record' do
          context

          expect(user).not_to be_destroyed
        end

        it 'returns an error message' do
          expect(context.errors).to eq error_message
          expect(context.message).to be_nil
        end
      end
    end
  end
end
```

## Run tests

Run the tests and watch them fail

```bash
rspec spec/interactors/users/delete_spec.rb
```

And to run a single test

```bash
rspec spec/interactors/users/delete_spec.rb:20
```

## Make The Tests Pass

This is how our logic for updating a user will look like

```ruby[app/interactors/users/delete.rb]
# frozen_string_literal: true

module Users
  class Delete < BaseInteractor
    delegate :user, to: :context

    def call
      user.destroy!
      context.message = 'You have successfully deleted your account'
    rescue ActiveRecord::RecordNotDestroyed => e
      context.fail! errors: e.message, message: nil
    end
  end
end
```

Run all the tests again and verify everything works as expected.
