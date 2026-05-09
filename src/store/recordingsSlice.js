import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [],
};

const recordingsSlice = createSlice({
	name: "recordings",
	initialState,
	reducers: {
		addRecording: (state, action) => {
			// Ignore invalid payloads to keep the list consistent.
			if (!action.payload?.id) {
				return;
			}

			// Add new recordings first for better UX in FlatList.
			state.items.unshift(action.payload);
		},
		removeRecording: (state, action) => {
			const id = action.payload;
			state.items = state.items.filter((item) => item.id !== id);
		},
		clearRecordings: (state) => {
			state.items = [];
		},
	},
});

export const { addRecording, removeRecording, clearRecordings } =
	recordingsSlice.actions;

export default recordingsSlice.reducer;
