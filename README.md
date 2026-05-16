# EchoRave

Mobile app built with React Native and Expo to connect to a Flask/RAVE server, record audio, and run timbre transfer.

## Stack

- Expo
- React Native
- React Navigation (Material Top Tabs)
- Redux Toolkit + redux-persist
- React Native Paper[https://callstack.github.io/react-native-paper/]
- expo-av[https://docs.expo.dev/versions/latest/sdk/audio/]
- expo-file-system[https://docs.expo.dev/versions/latest/sdk/filesystem/]
- expo-document-picker[https://docs.expo.dev/versions/latest/sdk/document-picker/]

## Permissions

The app asks for microphone permission when the user starts recording.

## Server

This project uses the Python Flask server.

Server repository:

https://github.com/gnvIRCAM/RAVE-ONNX-Server

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

To open the app on a physical phone with Expo Go, keep the computer and phone on the same Wi-Fi network and scan the QR code shown by Expo.

If the Expo CLI has trouble connecting over the local network, use tunnel mode instead:

```bash
npx expo start --tunnel
```

The Flask server must be running and reachable on the same network. Enter the server IP and port on the Home screen and tap **Test connection**.

## References

- https://reactnavigation.org/docs/material-top-tab-navigator/
- https://redux-toolkit.js.org/
- https://callstack.github.io/react-native-paper/
- https://docs.expo.dev/versions/latest/sdk/document-picker/
- https://docs.expo.dev/versions/latest/sdk/audio/
