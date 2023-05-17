import "./Auth.css"

import {Link} from "react-router-dom";
import Message from "../../components/Message";

//Hooks
import { useEffect, useState } from "react";
import {useSelector, useDispatch} from "react-redux";

//Redux
import { login, reset } from "../../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

    // Feito exclusivamente para os inputs ficarem vermelhos na hora do erro
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch()

  const {loading, error} = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user = {
      email,
      password
    }

    try {
      await dispatch(login(user)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setShowError(true);

      // Foi feito essa ligação para o email e password não serem passados na Array
      setEmailError(email => !email);
      setPasswordError(password => !password);
      
      // Timer para tanto o erro quanto os inputs vermelhos sumirem depois de 2 segundos
      const timer = setTimeout(() => {
        setShowError(false);
        setEmailError(false);
        setPasswordError(false);
      }, 2000);
  
      return () => {
        clearTimeout(timer);
        setShowError(false); // Redefinir o estado ao sair da página
      };
    }
  }, [error, setEmailError, setPasswordError]);

  if(loading) {
    return (
        <div className="loading-container">
          <div className="lds-heart"><div></div></div>
        </div>
    );
  }

  return (
    <div id="login">
      <h2>Clonegram</h2>
      <p className="subtitle">Faça login para ver o que há de novo! &#128513;</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email || ""} className={error && emailError ? 'error' : ''} />
        <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ""} className={error && passwordError ? 'error' : ''} />
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {showError && <Message msg={error} type="error"/>}
      </form>
      <p>Não tem conta? <Link to="/registrar">Cadastrar</Link></p>
    </div>
  )
}

export default Login