---
title: Logout Token
description: Logout with token
position: 27
category: Authentication
---

## logging out

What happens when a user logs out? Hmmmm.

You cannot manually expire a token after it has been created. Thus, you cannot log out with JWT on the server-side as you do with sessions.

JWT is stateless, meaning that you should store everything you need in the payload and skip performing a DB query on every request. But if you plan to have a strict log out functionality, that cannot wait for the token auto-expiration, even though you have cleaned the token from the client-side, then you might need to neglect the stateless logic and do some queries. So what's a solution?

- Set a reasonable expiration time on tokens

- Delete the token from client-side upon log out

- Query provided token against The Blacklist on every authorized request

We will use the second approach - deleting/removing the token from the client side upon logout.

This means if you had passed the token on the header like so `Authorization: "Bearer <the_token>"`, then what you have to do, upon logout, is to simply delete <the_token> from the authorization headers.

If the user attempts another request to our API after logout, the headers will have no token, i.e `Authorization: "Bearer "`, and the API will throw an error, asking the user to sign up or login before accessing the page.
