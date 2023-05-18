import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
    photos: [],
    photo: {},
    error: false,
    success: false,
    loading: false,
    message: null
  };

// Publicar uma postagem
export const publishPhoto = createAsyncThunk(
    "foto/publicar",
    async (photo, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token // Pegar o token

        const data = await photoService.publishPhoto(photo, token)

        // Verificar erros
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
);

// Pegar postagem do usuário
export const getUserPhotos = createAsyncThunk(
    "foto/postagemusuario",
    async (id, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.getUserPhotos(id, token);

        return data;
    }
)

// Deletar uma postagem
export const deletePhoto = createAsyncThunk(
    "foto/deletar",
    async (id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.deletePhoto(id, token);

        // Verificar erros
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        
        return data;
    }
)

// Editar uma postagem
export const updatePhoto = createAsyncThunk(
    "foto/atualizar",
    async (photoData, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.updatePhoto({title: photoData.title, body: photoData.body}, photoData.id, token);

        // Verificar erros
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        
        return data;
    }
)

export const photoSlice = createSlice({
    name: "foto",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(publishPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(publishPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            const newPhoto = action.payload;
          
            state.photos = [newPhoto, ...state.photos]; // Adiciona a nova foto no início da matriz
          
            state.message = "Postagem publicada com sucesso!"
        }).addCase(publishPhoto.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.photo = {};
            state.message = null;
        }).addCase(getUserPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(getUserPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        }).addCase(deletePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(deletePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            
            state.photos = state.photos.filter((photo) => {
                return photo._id !== action.payload.id
            })

            state.message = action.payload.message;
        }).addCase(deletePhoto.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.photo = {};
            state.message = null;
        }).addCase(updatePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(updatePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            
            state.photos.map((photo) => {
                if(photo._id === action.payload.photo._id) {
                    return {
                        ...photo,
                        title: action.payload.photo.title,
                        body: action.payload.photo.body
                    }
                }
                return photo;
            })

            state.message = action.payload.message;
        }).addCase(updatePhoto.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.photo = {};
            state.message = null;
        })
    }
});

export const {resetMessage} = photoSlice.actions;
export default photoSlice.reducer;