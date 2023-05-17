import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import userService from "../services/userService";

const initialState = {
    user: {},
    error: false,
    success: false,
    loading: false,
    message: null
}

// Funções

// Pegar os detalhes do usuário
export const profile = createAsyncThunk(
    "usuario/perfil",
    async (user, thunkAPI) => {
        // Pegar o user no authSlice e validar com o token
        const token = thunkAPI.getState().auth.user.token;
        const data = await userService.profile(user, token)

        // Não é nescessário checagem por erros aqui pois na teoria as informações já deveriam estar corretas

        return data;
    }
)

// Atualizar informação do usuário
export const updateProfile = createAsyncThunk(
    "usuario/atualizar",
    async (user, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
      const data = await userService.updateProfile(user, token);
  
      // Checagem por erros
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]); // Pegar e mostrar o erro 0(Primeiro)
      }
  
      return data;
    }
);

// Pegar detalhes do usuário por ID
export const getUserDetails = createAsyncThunk(
    "usuario/detalhes",
    async (id, thunkAPI) => {
        const data = await userService.getUserDetails(id);

        return data;
    }
)

export const userSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(profile.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(profile.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }).addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
            state.message = "Usuário atualizado com sucesso!"
        }).addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.user = {};
            state.message = null;
        }).addCase(getUserDetails.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(getUserDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        })
    }
});

export const {resetMessage} = userSlice.actions
export default userSlice.reducer;