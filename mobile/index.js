// Plain Expo entry point (no Expo Router) -- this app uses React Navigation
// directly (see app/navigation/appnavigator.tsx). Registering the App
// component here is the standard pre-router Expo pattern; see
// package.json's "main" field, which points here instead of
// "expo-router/entry".
import { registerRootComponent } from 'expo';

import App from './app/index';

registerRootComponent(App);
