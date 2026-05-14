// how long to wait before giving up on a request
const DEFAULT_TIMEOUT_MS = 8000;

// in this file i make all the communication with the RAVE server using fetch.

// remove trailing slash so urls like "http://192.168.1.1:5000/" become consistent
function normalizeBaseUrl(baseUrl) {
	return String(baseUrl || "").trim().replace(/\/$/, "");
}

// turn a fetch error into a readable string for the user
function buildErrorMessage(error, fallback = "Request failed") {
	// abortError means the request timed out (server did not reply in time)
	if (error?.name === "AbortError") {
		return "Request timeout. Please check server reachability.";
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallback;
}

// read response as text and return empty string on parse failure
async function safeReadText(response) {
	try {
		return await response.text();
	} catch (error) {
		console.warn("safeReadText failed:", error);
		return "";
	}
}

// read response as json and return null if parsing fails
async function safeReadJson(response) {
	try {
		return await response.json();
	} catch (error) {
		console.warn("safeReadJson failed:", error);
		return null;
	}
}

// wrap fetch with a timeout so the app does not freeze when the server is offline
// abortController cancels the fetch after timeoutMs milliseconds
async function requestWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		return response;
	} finally {
		// always clear the timer, whether the request succeeded or failed
		clearTimeout(timeoutId);
	}
}

// extract the file name from a local uri
// example: "file:///data/recordings/take1.m4a" so "take1.m4a"
function inferFileNameFromUri(uri) {
	const raw = String(uri || "").split("?")[0];
	const lastChunk = raw.split("/").pop() || "recording.m4a";
	return lastChunk.trim() || "recording.m4a";
}

// return the correct mime type based on the file extension
function inferMimeType(fileName) {
	const lowerName = String(fileName || "").toLowerCase();

	if (lowerName.endsWith(".wav")) {
		return "audio/wav";
	}

	if (lowerName.endsWith(".m4a")) {
		return "audio/m4a";
	}

	if (lowerName.endsWith(".mp3")) {
		return "audio/mpeg";
	}

	// fallback for unknown formats
	return "application/octet-stream";
}

// build the base url from ip and port entered by the user on the home screen
export function buildBaseUrl(ip, port) {
	const cleanIp = String(ip || "").trim();
	const cleanPort = String(port || "").trim();

	if (!cleanIp || !cleanPort) {
		return "";
	}

	return `http://${cleanIp}:${cleanPort}`;
}

// ping the server root endpoint to check if it is reachable
// returns { ok: true/false, message: string }
export async function testConnection(baseUrl) {
	const cleanBaseUrl = normalizeBaseUrl(baseUrl);

	if (!cleanBaseUrl) {
		return { ok: false, message: "Missing server URL." };
	}

	try {
		const response = await requestWithTimeout(`${cleanBaseUrl}/`);
		const text = await safeReadText(response);
		const message = text || `Server replied with status ${response.status}`;

		if (!response.ok) {
			return { ok: false, message };
		}

		return { ok: true, message };
	} catch (error) {
		return { ok: false, message: buildErrorMessage(error, "Connection failed") };
	}
}

// the server can return models as a plain array or wrapped in an object
// this function handles both cases and always returns a plain string array
function extractModels(payload) {
	if (Array.isArray(payload)) {
		return payload;
	}

	if (!payload || typeof payload !== "object") {
		return [];
	}

	// try common field names the server might use
	const possibleArrays = [
		payload.models,
		payload.modelList,
		payload.data,
		payload.items,
	];

	for (const candidate of possibleArrays) {
		if (Array.isArray(candidate)) {
			return candidate.filter((item) => typeof item === "string");
		}
	}

	return [];
}

// fetch the list of available RAVE models from the server
// returns an array of model name strings, or empty array on failure
export async function getModels(baseUrl) {
	const cleanBaseUrl = normalizeBaseUrl(baseUrl);

	if (!cleanBaseUrl) {
		return [];
	}

	try {
		const response = await requestWithTimeout(`${cleanBaseUrl}/getmodels`);

		if (!response.ok) {
			return [];
		}

		const payload = await safeReadJson(response);
		return extractModels(payload);
	} catch (error) {
		console.warn("getModels failed:", error);
		return [];
	}
}

// tell the server which RAVE model to use for the next transformation
export async function selectModel(baseUrl, modelName) {
	const cleanBaseUrl = normalizeBaseUrl(baseUrl);
	const cleanModel = String(modelName || "").trim();

	if (!cleanBaseUrl) {
		return { ok: false, message: "Missing server URL." };
	}

	if (!cleanModel) {
		return { ok: false, message: "Missing model name." };
	}

	try {
		// encode the model name so special characters do not break the url
		const encodedModel = encodeURIComponent(cleanModel);
		const response = await requestWithTimeout(
			`${cleanBaseUrl}/selectModel/${encodedModel}`
		);
		const text = await safeReadText(response);
		const message = text || `Server replied with status ${response.status}`;

		if (!response.ok) {
			return { ok: false, message };
		}

		return { ok: true, message };
	} catch (error) {
		return { ok: false, message: buildErrorMessage(error, "Model selection failed") };
	}
}

// send an audio file to the server using multipart/form-data
// the server stores the file and uses it when the user triggers the transformation
export async function uploadAudio(baseUrl, audioUri) {
	const cleanBaseUrl = normalizeBaseUrl(baseUrl);
	const cleanAudioUri = String(audioUri || "").trim();

	if (!cleanBaseUrl) {
		return { ok: false, message: "Missing server URL." };
	}

	if (!cleanAudioUri) {
		return { ok: false, message: "Missing audio URI." };
	}

	const fileName = inferFileNameFromUri(cleanAudioUri);
	const mimeType = inferMimeType(fileName);
	const formData = new FormData();

	// flask expects the audio file under the field name "file"
	formData.append("file", {
		uri: cleanAudioUri,
		name: fileName,
		type: mimeType,
	});

	try {
		const response = await requestWithTimeout(`${cleanBaseUrl}/upload`, {
			method: "POST",
			body: formData,
		});
		const text = await safeReadText(response);
		const message = text || `Server replied with status ${response.status}`;

		if (!response.ok) {
			return { ok: false, message };
		}

		return { ok: true, message };
	} catch (error) {
		return { ok: false, message: buildErrorMessage(error, "Upload failed") };
	}
}

// return the full url to download the transformed audio from the server
// the caller should use expo-file-system to save the file locally
export function getDownloadUrl(baseUrl) {
	const cleanBaseUrl = normalizeBaseUrl(baseUrl);

	if (!cleanBaseUrl) {
		return "";
	}

	return `${cleanBaseUrl}/download`;
}
