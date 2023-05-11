const User = require("../models/User")
 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
 
const jwtSecret = process.env.JWT_SECRET
 
// Gerar token do usuário
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '7d',
    })
}
 
// Registrar usuário e logar
const register = async (req, res) => {
    try {
    const {name, profileName, email, password} = req.body

    // Conferir se o usuário existe
    const user = await User.findOne({email});
    const profileUser = await User.findOne({ profileName });

    if(user) {
        res.status(422).json({errors: ["Email já está sendo utilizado!"]})
        return
    }
    if (profileUser) {
        res.status(422).json({ errors: ["Nome do usuário já está sendo utilizado!"] });
        return
    }

    // Gerar hash de senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar usuário
    const newUser = await User.create({
        name,
        profileName,
        email,
        password: passwordHash
    });

    // Conferir se o usuário foi criado com sucesso
    if (!newUser) {
        res.status(422).json({ errors: ['Houve um erro, por favor tente mais tarde.'] });
        return
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    });
    }
    catch (error) {
        res.status(500).json({ errors: ['Houve um erro, por favor tente mais tarde.'] });
        return
    }
}

// Logar usuário
const login = async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email});

    // Checar se usuário existe
    if(!user) {
        res.status(404).json({errors: ["Usuário não encontrado!"]})
        return
    }

    // Checar se a senha bate
    if(!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors: ["Senha inválida!"]})
        return
    }

    //Retornar token do usuário
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    });
}

// Pegar o usuário já logado
const getCurrentUser = async(req, res) => {
    const user = req.user

    res.status(200).json(user);
}

// Atualizar o perfil do usuário
const update = async (req, res) => {
    const {name, password, bio} = req.body

    let profileImage = null

    if(req.file) {
        profileImage = req.file.filename;
    }

    // Como a ID do MongoDB parece um Token, precisou converter para um tipo de ObjectId e retirar o password
    const reqUser = req.user
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password");

    if(name) {
        user.name = name
    }

    if(password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash
    }

    if(profileImage) {
        user.profileImage = profileImage
    }

    if(bio) {
        user.bio = bio
    }

    // Salvar no banco
    await user.save()

    // Mostrar os campos alterados
    res.status(200).json(user);
}

const getUserById = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findById(mongoose.Types.ObjectId.createFromHexString(id)).select("-password");
    
        // Checar se o usuário existe
        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado!"] });
            return;
          }
      
          // Mostrar o usuário pesquisado
          res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ errors: ["Usuário não encontrado!"] });
        return;
    }

}
 
module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
}