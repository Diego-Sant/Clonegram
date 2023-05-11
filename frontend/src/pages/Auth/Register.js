import "./Auth.css";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Message from "../../components/Message";

//Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [profileName, setProfileName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Criado para ser usado no timer
  const [showError, setShowError] = useState(false);

  // Feito exclusivamente para os inputs ficarem vermelhos na hora do erro
  const [nameError, setNameError] = useState(false);
  const [profileNameError, setProfileNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  // Contagem de caracteres
  const [nameCharCount, setNameCharCount] = useState(0);
  const [profileNameCharCount, setProfileNameCharCount] = useState(0);
  
  // Permite usar as funções Redux
  const dispatch = useDispatch()

  const {loading, error} = useSelector((state) => state.auth);

  function handleProfileNameChange(event) {
    // Adiciona @ no início toda vez que o usuário for digitar no input
    let newValue = event.target.value;
    if (!newValue || newValue.startsWith("@")) {
      setProfileName(newValue);
    }
    else if (newValue.indexOf("@") === -1) {
      newValue = "@" + newValue;
      setProfileName(newValue);
    } else {
      setProfileName(`@${newValue}`);
    }

    // Feito isso para o charCount não contabilizar o @ que vem no início do profileName
    const atIndex = newValue.indexOf("@");
    setProfileNameCharCount(newValue.slice(atIndex + 1).length);
  }

  // Contagem básica para o input específico contabilizar todos os caracteres que estão sendo digitados
  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setNameCharCount(newName.length);
  }

  const handleSubmit  = (e) => {
    e.preventDefault();

    const user = {
      name,
      profileName,
      email,
      password,
      confirmPassword
    }

    console.log(user)

    dispatch(register(user));
  };

  // Resetar tudo depois de ativar o dispatch
  useEffect(() => {
    dispatch(reset());
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setShowError(true);

      // Foi feito essa ligação para o name, profileName, email, password e confirmPassword não serem passado na Array
      setNameError(name => !name);
      setProfileNameError(profileName => !profileName);
      setEmailError(email => !email);
      setPasswordError(password => !password);
      setConfirmPasswordError(confirmPassword => !confirmPassword);
      
      // Timer para tanto o erro quanto os inputs vermelhos sumirem depois de 2 segundos
      const timer = setTimeout(() => {
        setShowError(false);
        setNameError(false);
        setProfileNameError(false);
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
      }, 2000);
  
      return () => {
        clearTimeout(timer);
        setShowError(false); // Redefinir o estado ao sair da página
      };
    }
  }, [error, setNameError, setProfileNameError, setEmailError, setPasswordError, setConfirmPasswordError]);

  return (
    <div id="register">
      <h2>Clonegram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos &#128221;</p>
      <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input type="text" placeholder="Nome" value={name || ""} onChange={handleNameChange} className={`forminput ${error && nameError && showError ? 'error' : ''}`} />
            <div className="char-count">{nameCharCount}/25 caracteres</div>
          </div>
          <div className="input-wrapper">
            <input id="forminput" type="text" placeholder="Nome do usuário" value={profileName || ""} onChange={handleProfileNameChange} className={`forminput ${error && profileNameError ? 'error' : ''}`} />
            <div className="char-count">{profileNameCharCount}/15 caracteres</div>
          </div>
          <input type="email" placeholder="Email" value={email || ""} onChange={(e) => setEmail(e.target.value)} className={error && emailError ? 'error' : ''} />
          <input type="password" placeholder="Senha" value={password || ""} onChange={(e) => setPassword(e.target.value)} className={error && passwordError ? 'error' : ''} />
          <input type="password" placeholder="Confirme a senha" value={confirmPassword || ""} onChange={(e) => setConfirmPassword(e.target.value)} className={error && confirmPasswordError ? 'error' : ''} />
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {showError && <Message msg={error} type="error"/>}
      </form>
      <p>Já tem conta? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register