// Requisição HTTP para Login e Registro

import {api, requestConfig} from "../utils/config"

// Registrar um usuário
const register = async(data) => {
    const config = requestConfig("POST", data)

    try {
        const res = await fetch(api + "/usuarios/registrar", config).then((res) => res.json()).catch((err) => err)
    
        if (res._id) {
            localStorage.setItem('user', JSON.stringify(res));
        }

        return res;
    } catch (error) {
        console.log(error)
    }
};

// Logout
const logout = () => {
    localStorage.removeItem("user")
}

// Login
const login = async(data) => {
    const config = requestConfig("POST", data)

    try {
        const res = await fetch(api + "/usuarios/login", config).then((res) => res.json()).catch((err) => err)
    
        if (res._id) {
            localStorage.setItem('user', JSON.stringify(res));
        }
      

        return res;
    } catch (error) {
        console.log(error)
    }
}

const authService = {
    register,
    logout,
    login,
}

export default authService;