import {api, requestConfig} from "../utils/config"

// Pegar detalhes do usuário
const profile = async (data, token) => {
    const config = requestConfig("GET", data, token);

    try {
        const res = await fetch(api + "/usuarios/perfil", config).then((res) => res.json()).catch((err) => err)
    
        return res;
    } catch (error) {
        console.log(error)
    }
};

// Atualizar informação do usuário
const updateProfile = async (data, token) => {
    const config = requestConfig("PUT", data, token, true)

    try {
        const res = await fetch(api + "/usuarios/", config).then((res) => res.json()).catch((err) => err)

        return res;
    } catch (error) {
        console.log(error)
    }
}

// Pegar detalhes do usuário por ID
const getUserDetails = async (id) => {
    const config = requestConfig("GET") // Não é necessário passar o Token pois é uma rota pública

    try {
        const res = await fetch(api + "/usuarios/" + id, config).then((res) => res.json()).catch((err) => err)

        return res;
    } catch (error) {
        console.log(error)
    }
}

const userService = {
    profile,
    updateProfile,
    getUserDetails
}

export default userService;