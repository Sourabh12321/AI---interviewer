import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axiosConfig';

export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ email, name }) => {
    const res = await axios.post('/user/send-otp', { email });
    return res.data;
})

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/user/signup', userData);
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



export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await axios.post('/user/login', { email, password });
            return res.data;
        } catch (error) {
            if (error.response?.data?.message) {
                return rejectWithValue({ message: error.response.data.message });
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        user: null,
        otpSent: false,
        isOtpVerified: false,
        error: null,
    },
    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.otpSent = false;
            state.isOtpVerified = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                state.user = action.payload;

            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.user = { message: action.payload };
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
            })
            .addCase(signup.rejected, (state, action) => {
                console.log('action', action)
                state.loading = false;
                state.error = action.payload;
                state.user = action.payload;
            })
            .addCase(signup.fulfilled, (state, action) => {
                console.log('actionfull', action)
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.user = action.payload ;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            });
    },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;