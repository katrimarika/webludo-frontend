# KimbIe frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/ee12766a-ab4d-4610-985b-1acdb8d9edb5/deploy-status)](https://app.netlify.com/sites/loving-ardinghelli-fa9c33/deploys)

A static web application for a virtual Kalja-Kimble boardgame. Built using Preact, Typescript, Parcel and Phoenix. Made for [Klipi's Phoenix backend](https://github.com/klipi/web_kimble).

## Development workflow

1. Set the socket connection url environment variable e.g. be creating a `.env` file based on `.env.sample` and run `source .env`
1. `npm install`
1. `npm start`

Create a production build: `npm run build`

Point PRs to `master`. Release by merging `master` to `production`.

## TODO

- create script for releases
- handle "doubled" animations, order: move - doubled - effects
- better current player flash animation for multiplied pieces
- better chat styles
- handle less than 4 players (when api handles them)
- sounds:
  1. die roll
  1. move
  1. and so on...
  1. adjusting sound settings
  1. background music
