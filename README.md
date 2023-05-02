# Musica Vite

This is a Spotify clone web app that allows users to sign up/login, see the list of all songs available and listen to them, upload music, add comments to a specific song and see comments from other users.

## Features

- Global store using Pinia
- Routing using Vue Router
- Form Validation using VeeValidate
- Internationalization (EN | NL)
- Authentication & Authorization
- MP3 support (play/pause/resume)
- Upload songs
- Edit songs data (name, genre)
- Add comments to songs from other users

## Technologies

- Vue.js
- Tailwind CSS
- Firebase for database and files storage
- Vercel for deployment
- ESlint for code quality

## Vue.js Cheatsheet

### Template Syntax

Dynamic event handlers: `@[eventName]`
Dynamic directive argument: `:[attributeName]`
If you need to pass a complex dynamic argument, it's probably better to use a computed property
Directive syntax: `[name argument modifier value]`

### Reactivity Fundamentals

- We use the `data` option to declare reactive state of a component.
- void using arrow functions when defining `methods`
- `methods` Inside a template they are most commonly used as event listeners:
- `nextTick()` to access the updated DOM

### Computed Properties

- For complex logic that includes reactive data
- A `method` invocation will always run the function whenever a re-render happens. A `computed property` will only re-evaluate when some of its reactive dependencies have changed.
- They are cached --> for complex computations
- By default they are getters. Don't try to mutate them. It doesn't make sense to mutate snapshots of data.
- They must be pure functions with no sde effects.

### Class and Style Bindings

- Powerful pattern: use dynamic class object as computed property and pass it to `v-bind:class`
- Object and Array syntax together: `<div :class="[{ active: isActive }, errorClass]"></div>`
- `$attrs` to pass component's class or class bindings to a specific root element if we have multiple root elements.

### Conditional Rendering

- `v-if`
- `v-else` must immediately follow a `v-if` or a `v-else-if` element
- `v-else-if` must immediately follow a `v-if` or a `v-else-if` element.

### List Rendering

- `v-for="(item, index) in items"`
- `v-for="(value, key, index) in myObject"`
- `v-for="n in 10"`
- Similar to template `v-if`, you can also use a `<template>` tag with v-for to render a block of multiple elements.
