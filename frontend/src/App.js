import './App.css';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import { useAuth } from './hooks/useAuth';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EditProfile from './pages/EditProfile/EditProfile';
import Profile from './pages/Profile/Profile';
import Photo from './pages/Photo/Photo';

function App() {
  const {auth, loading} = useAuth();

  if(loading) {
    return (
        <div className="loading-container">
          <div className="lds-heart"><div></div></div>
        </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className='container'>
          <Navbar />
              <Routes>
                <Route path="/" element={auth ? <Home /> : <Navigate to="/login"/>} />
                <Route path="/perfil" element={auth ? <EditProfile /> : <Navigate to="/login"/>} />
                <Route path="/usuarios/:id" element={auth ? <Profile /> : <Navigate to="/login"/>} />

                <Route path="/login" element={!auth ? <Login /> : <Navigate to="/"/>}/>
                <Route path="/registrar" element={!auth ? <Register /> : <Navigate to="/"/>}/>

                <Route path="/fotos/:id" element={auth ? <Photo /> : <Navigate to="/login"/>} />
              </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;