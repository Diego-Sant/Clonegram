export const api = "http://localhost:5000/api"
export const upload = "http://localhost:5000/uploads"

export const requestConfig = (method, data, token = null, image = null) => {
    let config

    // Se tiver uma imagem
    if(image) {
        config = {
            method,
            body: data,
            headers: {}
        }
    // Caso for delete ou não tiver nenhum dado
    } else if(method === "DELETE" || data === null) {
        config = {
            method,
            headers: {}
        }
    // Inserção de dados no sistema
    } else {
        config = {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
}