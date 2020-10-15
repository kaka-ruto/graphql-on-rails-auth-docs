---
title: Authorization
description: Authorizing API Requests
position: 31
category: Authorization
---

## What is authorization

Authorization determines whether a user has access or not, to a particular resource or action.

Authentication will help us identify a user, and then authorization will help us determine whether a user is allowed to access something or perform some action.

For example, authorization helps us answer the following questions:

- Is this user allowed to view this user? How about viewing all users?

- Is this user allowed to edit/update this user? How about updating all users?

- Is this user allowed to delete this user? How about deleting all users?

Among many other actions.

Mostly, standard users have access to their own resources, things they created. For example their own accounts.

Admins have more privileges. For example they can add or remove users from a team account.

Super admins have even more priviliges, for example they can hide/delete tweets from Donald Trump.

## Authorization in a Rails API

There are many gems/libraries used for authorization in the Rails world.

For our case, we will use the [ActionPolicy](https://github.com/palkan/action_policy) gem
