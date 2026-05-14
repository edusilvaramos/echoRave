# EchoRave

Mobile app built with React Native and Expo to connect to a Flask/RAVE server, record audio, and run timbre transfer.

## Stack

- Expo
- React Native
- React Navigation (Material Top Tabs)
- Redux Toolkit + redux-persist
- React Native Paper
- expo-av
- expo-file-system
- expo-document-picker

## Permissions

The app asks for microphone permission when the user starts recording.

## Server API

Flask endpoints used by the app:

- `GET /` — connection test
- `GET /getmodels` — list available RAVE models
- `GET /selectModel/<modelname>` — set the active model
- `POST /upload` — send audio file (`.wav` or `.m4a`)
- `GET /download` — download the transformed audio

## Setup

```bash
npm install
npx expo start
```

The Flask server must be running and reachable on the same network. Enter the server IP and port on the Home screen and tap **Test connection**.

## References

- https://reactnavigation.org/docs/material-top-tab-navigator/
- https://redux-toolkit.js.org/
- https://callstack.github.io/react-native-paper/
- https://docs.expo.dev/versions/latest/sdk/filesystem/
- https://docs.expo.dev/versions/latest/sdk/document-picker/
- https://docs.expo.dev/versions/latest/sdk/audio/
- https://docs.expo.dev/versions/latest/sdk/filesystem/