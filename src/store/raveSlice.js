import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedAudio: null,
	// "default" | "recording" | "file"
	selectedSourceType: "default",
	transformedAudioUri: "",
	isProcessing: false,
	error: "",
};

const raveSlice = createSlice({
	name: "rave",
	initialState,
	reducers: {
		setSelectedAudio: (state, action) => {
			state.selectedAudio = action.payload || null;
		},
		setSelectedSourceType: (state, action) => {
			state.selectedSourceType = action.payload || "default";
		},
		setTransformedAudioUri: (state, action) => {
			state.transformedAudioUri = action.payload || "";
		},
		setIsProcessing: (state, action) => {
			state.isProcessing = Boolean(action.payload);
		},
		setRaveError: (state, action) => {
			state.error = action.payload || "";
		},
		resetRave: () => initialState,
	},
});

export const {
	setSelectedAudio,
	setSelectedSourceType,
	setTransformedAudioUri,
	setIsProcessing,
	setRaveError,
	resetRave,
} = raveSlice.actions;

export default raveSlice.reducer;
