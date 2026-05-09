import { createSlice } from "@reduxjs/toolkit";

// Build one normalized base URL used by all API calls.
function buildBaseUrl(ip, port) {
	const cleanIp = String(ip || "").trim();
	const cleanPort = String(port || "").trim();

	if (!cleanIp || !cleanPort) {
		return "";
	}

	return `http://${cleanIp}:${cleanPort}`;
}

const initialState = {
	ip: "",
	port: "",
	baseUrl: "",
	isConnected: false,
	models: [],
	selectedModel: "",
	connectionStatus: "idle",
	error: "",
};

const serverSlice = createSlice({
	name: "server",
	initialState,
	reducers: {
		setServerInfo: (state, action) => {
			const { ip = "", port = "" } = action.payload || {};
			state.ip = String(ip).trim();
			state.port = String(port).trim();
			state.baseUrl = buildBaseUrl(state.ip, state.port);
		},
		// Success clears old errors and marks the connection as stable.
		setConnectionSuccess: (state) => {
			state.isConnected = true;
			state.connectionStatus = "connected";
			state.error = "";
		},
		setConnectionError: (state, action) => {
			state.isConnected = false;
			state.connectionStatus = "error";
			state.error = action.payload ?? "Connection failed";
		},
		setModels: (state, action) => {
			state.models = Array.isArray(action.payload) ? action.payload : [];
		},
		setSelectedModel: (state, action) => {
			state.selectedModel = action.payload || "";
		},
		resetServer: () => initialState,
	},
});

export const {
	setServerInfo,
	setConnectionSuccess,
	setConnectionError,
	setModels,
	setSelectedModel,
	resetServer,
} = serverSlice.actions;

export default serverSlice.reducer;
