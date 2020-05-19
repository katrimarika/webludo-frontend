# Webludo frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/ee12766a-ab4d-4610-985b-1acdb8d9edb5/deploy-status)](https://app.netlify.com/sites/loving-ardinghelli-fa9c33/deploys)

A static web application for a virtual "Kalja-Kimble" boardgame. Built using Preact, Typescript, Parcel and Phoenix. Made for [oniskanen's Phoenix backend](https://github.com/oniskanen/webludo-server).

## Development workflow

1. Set the socket connection url environment variable e.g. be creating a `.env` file based on `.env.sample` and run `source .env`
1. `npm install`
1. `npm start`

To check code style: `npm run lint`

Create a production build: `npm run build`

Point PRs to `master` branch. Production is deployed automatically from `production` branch. Do a release with the provided script in `master` branch `npm run release`.

## TODO

Not ordered by priority

- host can put players in teams in game setup
- api sending negative indices for pieces in goal for multiple pieces 0
- handle less than 4 players (when api handles them)
- animations end when player state is updated during (e.g. someone finishes a penalty during a move animation)
- update gained penalties and related announcements only after animations
- update current player marker only after die animation (when no move action)
- new game button (option to use current players with new teams or empty)
- better highlighting available actions (die/pieces)
- total accumulated penalties count for each player
- leave game (especially if joined only as a spectator)
- changelog (code changes affecting users) on the lobby page
- rules readable on home page
- prevent double clicking start game button
- show in tab when new messages
- tag players in chat messages
- confett rain when first player finishes
- toasts or overlays of announcements
- chat to the side on extra wide screens
- links as clickable links in chat
- local multiplayer
- sounds:
  1. die roll
  1. move
  1. and so on...
  1. adjusting sound settings
  1. background music

### Ideas

- prevent opening a non-existent game
- allow rolling die on not-own turn -> penalty
- playing agains AI
- different levels of autonomy: from "automatic move when only one option" to "needing to move the piece yourself (and no limitations for correct spots)"
- voice control, ezpecially for "jag bor i hembo"
- voice chat
- die animation variants (or even based on the previous and next results)
