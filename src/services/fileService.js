import { Directory, File, Paths } from "expo-file-system";

export const RECORDINGS_DIR = new Directory(Paths.document, "recordings").uri;
export const TRANSFORMED_DIR = new Directory(Paths.document, "transformed").uri;

// this makes sure the app has a writable directory before copying or downloading
export async function ensureDirectoryExists(directory) {
  if (!directory) {
    return false;
  }

  try {
    const folder = new Directory(directory);

    if (!folder.exists) {
      // create the folder only when it is missing
      folder.create({ intermediates: true, idempotent: true });
    }

    return true;
  } catch (error) {
    console.warn("ensureDirectoryExists failed:", error);
    return false;
  }
}

// prepare both folders used by the recording and transformation flows
export async function ensureAudioDirectories() {
  const recordingsOk = await ensureDirectoryExists(RECORDINGS_DIR);
  const transformedOk = await ensureDirectoryExists(TRANSFORMED_DIR);

  return recordingsOk && transformedOk;
}

// turn a user label into a safe file name like meu-audio-1712345678.m4a
export function generateRecordingFileName(name) {
  const timestamp = Date.now();
  const safeName = String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "recording"}-${timestamp}.m4a`;
}

// copy the temporary recording into the persistent recordings folder
export async function copyRecordingToPersistentStorage(tempUri, name) {
  if (!tempUri) {
    return null;
  }

  const directoryReady = await ensureDirectoryExists(RECORDINGS_DIR);

  if (!directoryReady) {
    return null;
  }

  try {
    const sourceFile = new File(tempUri);

    if (!sourceFile.exists) {
      return null;
    }

    // save the recording outside cache so redux never points to a temp file
    const destinationFile = new File(
      RECORDINGS_DIR,
      generateRecordingFileName(name),
    );
    sourceFile.copy(destinationFile);
    return destinationFile.uri;
  } catch (error) {
    console.warn("copyRecordingToPersistentStorage failed:", error);
    return null;
  }
}

// delete a file only when it exists so cleanup stays safe
export async function deleteFileIfExists(uri) {
  if (!uri) {
    return false;
  }

  try {
    const file = new File(uri);

    if (!file.exists) {
      return false;
    }

    // delete only after confirming the file is still there
    file.delete();
    return true;
  } catch (error) {
    console.warn("deleteFileIfExists failed:", error);
    return false;
  }
}

// download the transformed audio into the app storage and return the local uri
export async function downloadTransformedAudio(downloadUrl) {
  if (!downloadUrl) {
    return null;
  }

  const directoryReady = await ensureDirectoryExists(TRANSFORMED_DIR);

  if (!directoryReady) {
    return null;
  }

  try {
    // download directly into app storage so the result stays available offline
    const destinationFile = new File(
      TRANSFORMED_DIR,
      `transformed-${Date.now()}.wav`,
    );
    const downloadedFile = await File.downloadFileAsync(
      downloadUrl,
      destinationFile,
      {
        idempotent: true,
      },
    );

    return downloadedFile.uri;
  } catch (error) {
    console.warn("downloadTransformedAudio failed:", error);
    return null;
  }
}
