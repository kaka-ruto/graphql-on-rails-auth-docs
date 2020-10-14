---
title: Authenticate API Requests
description: Authenticating all requests
position: 28
category: Authenticating Requests
---

## Authenticating Requests

Most of the actions the user will be performing will need to be authenticated, so we get to know who does what.

The `GraphQLController` handles all our requests.

It inherits from the `ApplicationController`.

We will add logic to the `application_controller` to check all requests for a token.

If the token is present, attempt to decode it and get the user id.

If the user id is gotten, find the user with that id, and call it the `current_user`.

We will use this `current_user` throughout the application, always checking before they do any action.

If the we couldn't decode the token for some reason, eg (ExpiredSignature, VerificationError or DecodeError), we return :unauthorized error code. Later on we will return a better error message.

And if the token is not present, we do not throw an error yet, this is helpful for unauthenticated pages, those that do not need the token.

For requests that do need the token, we will throw an error before that action is permitted.

Here goes the logic!

```ruby[app/controllers/application_controller.rb]
# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  before_action :authenticate_user

  def authenticate_user
    return if @current_user

    if request.headers['Authorization'].present?
      authenticate_or_request_with_http_token do |token|
        jwt_payload = JWT.decode(token, Rails.application.secrets.secret_key_base).first

        @current_user_id = jwt_payload['id']
      rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
        head :unauthorized
      end
    end
  end

  def current_user
    @current_user ||= User.find(@current_user_id) if @current_user_id
  end

  def signed_in?
    @current_user_id.present?
  end
end
```

Sorry, we haven't written a test for this class, but on the next sections, we will be writing request/integration/e2e specs, which will make good use of the menthods in this class, and then we will tell if it works or not :)

We are using Rails' [authenticate_or_request_with_http_token](https://api.rubyonrails.org/classes/ActionController/HttpAuthentication/Token.html) method, which makes it dead easy to do HTTP Token authentication.
