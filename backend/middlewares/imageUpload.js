const multer = require("multer")
const path = require("path")

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ""

        // Identificar se a requisição ta vindo de users ou photos
        if (req.baseUrl.includes("users")) {
            folder = "users"
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos"
        }

        // Caminho onde a imagem ficará salva
        cb(null, `uploads/${folder}/`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) // Data do envio + jpg, png, etc
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/)) {
            return cb(new Error("Por envie apenas arquivos png, webp, svg, jpg ou jpeg!"))
        }
        cb(undefined, true)
    }
})

module.exports = {imageUpload}