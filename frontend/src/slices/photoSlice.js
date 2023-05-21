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

// Pegar postagem por id
export const getPhoto = createAsyncThunk(
    "foto/postagem",
    async (id, thunkAPI) => {
        
        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.getPhoto(id, token);

        return data;
    }
)

// Curtir a postagem
export const like = createAsyncThunk(
    "foto/curtida",
    async (id, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.like(id, token);

        // Verificar erros
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
)

// Retirar o like da postagem
export const unlike = createAsyncThunk(
    "foto/descurtida",
    async (id, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
  
      const data = await photoService.unlike(id, token);
  
      // Verificar erros
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }
  
      return data;
    }
);

// Adicionar comentário
export const comment = createAsyncThunk(
    "foto/comentario",
    async (commentData, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
  
        const data = await photoService.comment({comment: commentData.comment}, commentData.id, token);
    
        // Verificar erros
        if (data.errors) {
          return thunkAPI.rejectWithValue(data.errors[0]);
        }
    
        return data;
    }
)

// Pegar todas as postagens
export const getPhotos = createAsyncThunk(
    "foto/pegartudo",
    // Usado _ para o código identificar que o primeiro argumento é dispensável
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.getPhotos(token);

        return data;
    }
)

// Pesquisar por título, body e autor
export const searchPhotos = createAsyncThunk(
    "foto/pesquisa",
    async (query, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
  
        const data = await photoService.searchPhotos(query, token);
    
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
        // Publicar postagem
        builder.addCase(publishPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(publishPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photo = action.payload;
            state.photos.unshift(state.photo); // Adiciona a nova foto no início da matriz
            state.message = "Postagem publicada com sucesso!"
        }).addCase(publishPhoto.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.photo = {};
            state.message = null;
        })
        
        // Pegar postagens do usuário
        .addCase(getUserPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(getUserPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        })
        
        // Deletar postagem
        .addCase(deletePhoto.pending, (state) => {
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
        })
        
        // Atualizar postagem
        .addCase(updatePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(updatePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            
            state.photos = state.photos.map((photo) => {
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
        
        // Pegar postagem
        .addCase(getPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(getPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photo = action.payload;
        })

        // Curtir a postagem
        .addCase(like.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            
            // Colocar o id do usuário na requisição do like
            if(state.photo.likes) {
                state.photo.likes.push(action.payload.userId)
            }

            state.photos.map((photo) => {
                if(photo._id === action.payload.photoId) {
                    return photo.likes.push(action.payload.userId)
                }
                return photo;
            })

            state.message = action.payload.message;
        }).addCase(like.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.message = null;
        
        })
        
        // Retirar o like da postagem
        .addCase(unlike.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
          
            // Remover o id do usuário da requisição do like
            if (state.photo.likes) {
              const index = state.photo.likes.indexOf(action.payload.userId);
              if (index !== -1) {
                state.photo.likes.splice(index, 1);
              }
            }
          
            state.photos = state.photos.map((photo) => {
              if (photo._id === action.payload.photoId) {
                const index = photo.likes.indexOf(action.payload.userId);
                if (index !== -1) {
                  photo.likes.splice(index, 1);
                }
              }
              return photo;
            });
          
            state.message = action.payload.message;
        }).addCase(unlike.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.message = null;
        })
        
        // Adicionar comentário
        .addCase(comment.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            // Usando push ao em vez do unshift pois os comentários costumam ser do mais velho para o mais novo
            state.photo.comments.push(action.payload.comment);

            state.message = action.payload.message;
        }).addCase(comment.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
            state.message = null;
        
        })
        
        // Pegar todas as postagens
        .addCase(getPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(getPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        })

        // Pesquisar por título, body e autor
        .addCase(searchPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(searchPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.photos = action.payload;
        })
    }
});

export const {resetMessage} = photoSlice.actions;
export default photoSlice.reducer;