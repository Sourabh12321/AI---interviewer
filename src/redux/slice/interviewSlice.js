import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axiosConfig';

export const resumeData = createAsyncThunk(
    'interview/resume',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('/upload-resume', data);
            return response.data;
        } catch (error) {
            // ✅ Properly forward the error message from the backend
            console.log(error)
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue({ message: error.response.data.message }); // 👈 this becomes action.payload
            }
        }
    }
);


const interviewSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        error: null,
        questions: [],
    },
    reducers: {
        resetInterviewState: (state) => {
            state.loading = false;
            state.error = null;
            state.questions=[];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resumeData.pending, (state) => {
                state.loading = true;
            })
            .addCase(resumeData.fulfilled, (state, action) => {
                console.log('action.payload',action.payload)
                state.loading = false;
                state.questions = action.payload.questions;
            })
            .addCase(resumeData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { resetInterviewState } = interviewSlice.actions;
export default interviewSlice.reducer;

