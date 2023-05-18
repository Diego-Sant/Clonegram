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

const photoService = {
    publishPhoto,
    getUserPhotos,
    deletePhoto,
    updatePhoto
}

export default photoService;