# TCOAS Mobile

Expo / React Native client for the consulting opportunities platform. It
consumes the same backend as the web app (see the `rfp-opportunities`
repository) -- both clients read from one normalized opportunity API; no
business logic (open/expired status, filtering, sorting) is duplicated here.

## Get started

```bash
npm install
npx expo start
```

By default this points at a local backend on `http://localhost:8000`
(`http://10.0.2.2:8000` on the Android emulator, since it can't resolve
`localhost` as the host machine). To point at a real backend, set
`EXPO_PUBLIC_API_URL` before starting:

```bash
EXPO_PUBLIC_API_URL=https://consulting-opportunities-api.onrender.com npx expo start
```

In the output you'll find options to open the app in a development build,
an Android emulator, an iOS simulator, or [Expo Go](https://expo.dev/go).

## Navigation

This app uses [React Navigation](https://reactnavigation.org) directly
(`app/navigation/appnavigator.tsx`) -- a bottom-tab navigator (Home,
Search, Saved, Settings) nested in a stack navigator (adds Opportunity
Details, Notifications, Notification Settings on top). It does **not**
use Expo Router or file-based routing, despite the source living under an
`app/` directory (a holdover from the project's original scaffold).
`index.js` at the repo root registers `app/index.tsx`'s `App` component as
the entry point.

## Regenerating API types

`app/types/api.generated.ts` is generated from the backend's OpenAPI
schema, not hand-maintained. Re-run this whenever the backend's
`OpportunityOut` schema changes:

```bash
npm run generate:types
```

By default this reads from `http://localhost:8000/openapi.json`; set
`EXPO_PUBLIC_API_URL` to point it at a different backend first.

## Internal test builds (no App Store / Play Store)

`eas.json` defines three [EAS Build](https://docs.expo.dev/build/introduction/)
profiles for distributing installable builds directly, without any store
listing or review:

- `development` -- a dev client for local iteration.
- `preview` -- internal distribution: a plain installable `.apk` on
  Android, and an ad-hoc-signed `.ipa` on iOS. Each produces a link/QR
  code from `expo.dev` that a tester opens on their phone to install the
  app directly.
- `production` -- for eventual store submission.

`preview` and `production` both bake in `EXPO_PUBLIC_API_URL` pointing at
the deployed backend (`consulting-opportunities-api.onrender.com`) via
each profile's `env` block in `eas.json` -- unlike `npx expo start`, an
EAS Build runs on Expo's servers and never sees your local shell's env
vars, so without this every internal test build would silently fall back
to the dev-only `localhost`/`10.0.2.2` default and fail with a network
error on every request. Override per-build with `--profile` flags or
`eas.json` if you ever need a build pointed at a different backend.

One-time setup (requires your own Expo account):

```bash
npm install -g eas-cli
eas login
eas init          # links this project to your Expo account, sets extra.eas.projectId
```

Then, to cut a build for testers:

```bash
eas build --profile preview --platform android   # no account cost, installs anywhere
eas build --profile preview --platform ios       # requires a paid Apple Developer account;
                                                   # register each tester's device first:
                                                   #   eas device:create
```

`ios.bundleIdentifier` and `android.package` are currently set to the
placeholder `com.tcoas.mobile` -- change both to your own reverse-DNS
identifier before distributing real builds or ever submitting to a store.

## Project structure

```
app/
├── components/     Opportunity card, badges, empty/loading states
├── hooks/          React Query hooks (useJobs, useFilters, useNotifications, useSavedJobs)
├── navigation/      React Navigation setup
├── screens/        Home, Search, Details, Saved, Settings, Notifications
├── services/api/   API client, saved/notifications AsyncStorage persistence
├── types/          Generated API types + local (saved/notification) types
└── utils/          Date/urgency helpers, constants
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [React Navigation documentation](https://reactnavigation.org/docs/getting-started/)
