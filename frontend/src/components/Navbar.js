import "./Navbar.css"

import { NavLink, Link, useLocation } from "react-router-dom";
import {BsSearch, BsHouseFill, BsFillPersonVcardFill, BsFillPersonPlusFill} from 'react-icons/bs'

//Hooks
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import {logout, reset} from "../slices/authSlice"
import { useState } from "react";

const Navbar = () => {
  const {auth} = useAuth();
  const {user} = useSelector((state) => state.auth);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout())
    dispatch(reset())

    navigate("/login");
    setShowLogoutModal(false);
  }

  const location = useLocation();
  const hideSearch = location.pathname === "/login" || location.pathname === "/registrar"

  return (
    <nav id="nav">
      <Link to="/" id="title">Clonegram</Link>
      {/* Esconder barra de pesquisa caso a URL for /login ou /registrar */}
      {!hideSearch && (
        <div id="search-container">
          <form id="search-form">
            <BsSearch />
            <input type="text" placeholder="Pesquisar"/>
          </form>
        </div>
      )}

      {/* Modal de Confirmação */}
      {showLogoutModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Já está indo embora?</h2>
            <p>Tem certeza que deseja sair?</p>
            <div className="modal-actions">
              <button className="btn-logout" onClick={confirmLogout}>Sair</button>
              <button onClick={() => setShowLogoutModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <ul id="nav-links">
      {/* Aparecer essas opções apenas quando o usuário estiver autenticado */}
      {auth ? (
        <>
          <li>
            <NavLink to="/">
              <BsHouseFill />
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to={`/usuarios/${user._id}`}>
                <BsFillPersonVcardFill />
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/perfil">
              <BsFillPersonPlusFill />
            </NavLink>
          </li>
          <li>
            <span onClick={handleLogout}>Sair</span>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/login">
              Entrar
            </NavLink>
          </li>
          <li>
            <NavLink to="/registrar">
              Cadastrar
            </NavLink>
          </li>
        </>
      )} 
      </ul>
    </nav>
    
  )
}

export default Navbar