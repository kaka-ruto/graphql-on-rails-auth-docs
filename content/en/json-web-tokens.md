---
title: Introduction to JWTs
description: Authenticating Users using JWTs
position: 23
category: Authentication
---

## JWT
JSON Web Token(JWT) is an Internet standard for creating data with optional signature and/or optional encryption whose payload holds JSON that asserts some number of claims.

The tokens are signed either using a private secret or a public/private key.

For example, a server could generate a token that has the claim "logged in as admin" and provide that to a client. The client could then use that token to prove that it is logged in as admin.

The tokens can be signed by one party's private key (usually the server's) so that party can subsequently verify the token is legitimate. If the other party, by some suitable and trustworthy means, is in possession of the corresponding public key, they too are able to verify the token's legitimacy.

No middleman can modify a JWT once it’s sent.

## What is it good for?

JWT is a great technology for API authentication and server-to-server authorization.


## Using JWT for API authentication

A very common use of a JWT token, and the one you should probably only use JWT for, is as an API authentication mechanism.

The API generates the token and passes it to the client.

Depending on user action, the clinet will pass the token as part of subsequent requests to the API. The API will know it's that specific user because the request is signed with its unique identifier.


## Store JWTs securely
A JWT needs to be stored in a safe place inside the user’s browser.

If you store it inside localStorage, it’s accessible by any script inside your page (which is as bad as it sounds, as an XSS attack can let an external attacker get access to the token).

Don’t store it in local storage (or session storage). If any of the third-party scripts you include in your page gets compromised, it can access all your users’ tokens.

The JWT needs to be stored inside an httpOnly cookie, a special kind of cookie that’s only sent in HTTP requests to the server, and it’s never accessible (both for reading or writing) from JavaScript running in the browser.

Also expire tokens after a certain period. Do not keep tokens longer than required.


## Using JWT to securely exchange information

Since JWT are signed, the receiver can be sure the client is really who it thinks it is.
