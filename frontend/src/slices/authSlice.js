import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authService from "../services/authService";

// Pegar o usuário que foi criado
const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user ? user : null, // Caso tenha usuário, mantem o user, caso não, vire null
    error: false,
    success: false,
    loading: false,
};

// Registrar um usuário e logar
export const register = createAsyncThunk("auth/registrar", async (user, thunkAPI) => {
    const data = await authService.register(user)

    // Checagem de erros
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]) // Apenas mostrar o erro [0], ou seja, o primeiro
    }

    return data;
})

// Deslogar
export const logout = createAsyncThunk("auth/deslogar", async () => {
    await authService.logout();
})

// Logar um usuário
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    const data = await authService.login(user)

    // Checagem de erros
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]) // Apenas mostrar o erro [0], ou seja, o primeiro
    }

    return data;
})


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }).addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        }).addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = null;
        }).addCase(login.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }).addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        })
    }
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;