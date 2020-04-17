# KimbIe frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/ee12766a-ab4d-4610-985b-1acdb8d9edb5/deploy-status)](https://app.netlify.com/sites/loving-ardinghelli-fa9c33/deploys)

A static web application for a virtual Kalja-Kimble boardgame. Built using Preact, Typescript, Parcel and Phoenix. Made for [Klipi's Phoenix backend](https://github.com/klipi/web_kimble).

## Development workflow

1. Set the socket connection url environment variable e.g. be creating a `.env` file based on `.env.sample` and run `source .env`
1. `npm install`
1. `npm start`

To check code style: `npm run lint`

Create a production build: `npm run build`

Point PRs to `master` branch. Production is deployed automatically from `production` branch. Do a release with the provided script in `master` branch `npm run release`.

## TODO

- pulse animation on die system when it's your to roll + blur after roll
- api sending negative indices for pieces in goal for multiple pieces 0
- handle less than 4 players (when api handles them)
- agreeing on a new raise round
- jag bor i hembo
- calling missed jag bor i hembo
- sounds:
  1. die roll
  1. move
  1. and so on...
  1. adjusting sound settings
  1. background music
