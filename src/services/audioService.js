import { Audio } from "expo-av";

// keep a single recording preset so the screen logic stays simple
const RECORDING_OPTIONS = Audio.RecordingOptionsPresets.HIGH_QUALITY;

// ask the user for microphone permission before starting a recording
export async function requestAudioPermissions() {
  try {
    const response = await Audio.requestPermissionsAsync();
    return response?.granted === true;
  } catch (error) {
    // keep the app safe if permission cannot be checked
    console.warn("requestAudioPermissions failed:", error);
    return false;
  }
}

// configure the audio mode so recording works on mobile devices
export async function configureAudioModeForRecording() {
  try {
    // this mode is required so the microphone can record correctly
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    return true;
  } catch (error) {
    console.warn("configureAudioModeForRecording failed:", error);
    return false;
  }
}

// create and start a new recording session
export async function startRecording() {
  const recording = new Audio.Recording();

  await recording.prepareToRecordAsync(RECORDING_OPTIONS);
  await recording.startAsync();

  return recording;
}

// stop a recording and return the file uri and duration
export async function stopRecording(recording) {
  if (!recording) {
    return { uri: null, duration: 0 };
  }

  try {
    // unload the recording before reading its final data
    await recording.stopAndUnloadAsync();
  } catch (error) {
    console.warn("stopRecording stopAndUnloadAsync failed:", error);
  }

  let uri = null;
  let duration = 0;

  try {
    uri = recording.getURI();
  } catch (error) {
    console.warn("stopRecording getURI failed:", error);
  }

  try {
    // duration can fail on some devices, so keep a safe fallback
    const status = await recording.getStatusAsync();
    duration = status?.durationMillis ?? 0;
  } catch (error) {
    console.warn("stopRecording getStatusAsync failed:", error);
  }

  return { uri, duration };
}

// load a sound from a local uri so it can be played or unloaded later
export async function createSound(uri) {
  if (!uri) {
    return null;
  }

  const sound = new Audio.Sound();
  await sound.loadAsync({ uri });
  return sound;
}

// create a sound and start playback right away
export async function playSound(uri) {
  const sound = await createSound(uri);

  if (!sound) {
    return null;
  }

  await sound.playAsync();
  return sound;
}

// stop playback first, then unload the sound to avoid leaks
export async function stopAndUnloadSound(sound) {
  if (!sound) {
    return;
  }

  try {
    await sound.stopAsync();
  } catch (error) {
    console.warn("stopAndUnloadSound stopAsync failed:", error);
  }

  try {
    await sound.unloadAsync();
  } catch (error) {
    console.warn("stopAndUnloadSound unloadAsync failed:", error);
  }
}
