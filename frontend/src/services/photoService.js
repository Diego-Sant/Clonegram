import {api, requestConfig} from "../utils/config"

// Publicar uma postagem
const publishPhoto = async (data, token) => {
    const config = requestConfig("POST", data, token, true) // POST, enviar os dados, passar o token e true para imagem envolvida

    try {
        const res = await fetch(api + "/fotos", config).then((res) => res.json()).catch((err) => err)

        return res;
    } catch (error) {
        console.log(error)
    }
}

// Pegar postagens do usuário
const getUserPhotos = async (id, token) => {
    const config = requestConfig("GET", null, token); // dados nulos + token

    try {
        // "usuario" no singular
        const res = await fetch(api + "/fotos/usuario/" + id, config).then((res) => res.json()).catch((err) => err);

        return res;
    } catch (error) {
        console.log(error)
    }
};

// Deletar uma postagem
const deletePhoto = async (id, token) => {
    const config = requestConfig("DELETE", null, token); // dados nulos + token

    try {
        const res = await fetch(api + "/fotos/" + id, config).then((res) => res.json()).catch((err) => err);

        return res;
    } catch (error) {
        console.log(error)
    }
}

// Editar uma postagem
const updatePhoto = async (data, id, token) => {
    const config = requestConfig("PUT", data, token);

    try {
        const res = await fetch(api + "/fotos/" + id, config).then((res) => res.json()).catch((err) => err);

        return res;
    } catch (error) {
        console.log(error)
    }
}

// Pegar postagem por Id
const getPhoto = async (id, token) => {
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/fotos/" + id, config).then((res) => res.json()).catch((err) => err);
        
        return res;
    } catch (error) {
        console.log(error)
    }
};

// Curtir a postagem
const like = async (id, token) => {
    const config = requestConfig("PUT", null, token)

    try {
        const res = await fetch(api + "/fotos/curtida/" + id, config).then((res) => res.json()).catch((err) => err);
    
        return res;
    } catch (error) {
        console.log(error)
    }
}

// Retirar o like da postagem
const unlike = async (id, token) => {
    const config = requestConfig("PUT", { action: "unlike" }, token);

    try {
        const res = await fetch(api + "/fotos/curtida/" + id, config).then((res) => res.json()).catch((err) => err);

        return res;
    } catch (error) {
        console.log(error);
    }
};

// Adicionar comentário
const comment = async (data, id, token) => {
    const config = requestConfig("PUT", data, token)

    try {
        const res = await fetch(api + "/fotos/comentario/" + id, config).then((res) => res.json()).catch((err) => err);

        return res;
    } catch (error) {
        console.log(error)
    }
}

// Pegar todas as postagens
const getPhotos = async (token) => {
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/fotos", config).then((res) => res.json()).catch((err) => err);

        return res; 
    } catch (error) {
        console.log(error)
    }
}

// Pesquisar por título, body e autor
const searchPhotos = async(query, token) => {
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/fotos/pesquisar?q=" + query, config).then((res) => res.json()).catch((err) => err);

        return res;
    } catch (error) {
        console.log(error)
    }
}


const photoService = {
    publishPhoto,
    getUserPhotos,
    deletePhoto,
    updatePhoto,
    getPhoto,
    like,
    unlike,
    comment,
    getPhotos,
    searchPhotos
}

export default photoService;