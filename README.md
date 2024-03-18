# note-taker-ui
Frontend for note taker app. Backend code can be found [here](https://github.com/AnonymousRandomPerson/note-taker-server). The deployed app is accessed [here](https://note-taker-ui.fly.dev/).

## Running locally
1. Run `npm install` to download dependencies.
2. Run `npm run dev` to start the app.
3. Go to http://localhost:3001 in the browser to see the web UI.

By default, the UI reaches out to the deployed backend at https://note-taker-server.fly.dev. To use a locally run backend instead, start the backend server and database, then set the environment variable `SERVER_HOST` to http://localhost:3000.

Tests can be run with `npm run test`.

## Notes
See the [backend README](https://github.com/AnonymousRandomPerson/note-taker-server/blob/main/README.md#implementation) for implementation details, challenges, and potential changes.
