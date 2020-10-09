---
title: Authentication
description: Authenticating Users
position: 22
category: Authentication
---

## Authentication

Authentication is the process of verifying who a user is; and confirming they are who they say they are.

There are many authentication strategies, and following are a few of the common authentication methods used to secure modern systems.

1. Password-based authentication: where users provide a password and email or phone number

2. Multi-factor authentication: where authentication happens in two or more layers, if the first method was successful, a second one will follow. A popular example is where a user provides an email/phone and password and if that is correct, a code is sent to their phone or email and they're asked to enter that code on the system

3. Certificate-based authentication: this method uses digital certificates to identify users, or, mostly, machines and devices. Users provide their digital certificates when they sign in to a server. The server verifies the credibility of the digital signature and the certificate authority. The server then uses cryptography to confirm that the user has a correct private key associated with the certificate.

4. Biometric authentication: this identifies users by means of their unique biological characteristics. Facial recognition, voice identifiers, eye and fingerprint scanners are some of the methods used.

5. Token-based authentication: where users to enter their credentials once and receive a unique encrypted string of random characters in exchange. You can then use the token to access protected systems instead of entering your credentials all over again. The digital token proves that you already have access permission. Use cases of token-based authentication include APIs that are used by multiple frameworks and clients(eg web, mobile, desktop)

We will be using token-based authentication to secure our API.

Users will provide their email and password, and if they are correct, the backend will generate a token and pass it back as part of the response.

The client will pick that token and will pass it on subsequent requests, to which the backend will authenticate against
