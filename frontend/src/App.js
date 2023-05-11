import './App.css';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import { useAuth } from './hooks/useAuth';

import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const {auth, loading} = useAuth();

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className='container'>
          <Navbar />
              <Routes>
                <Route path="/" element={auth ? <Home /> : <Navigate to="/login"/>} />
                <Route path="/login" element={!auth ? <Login /> : <Navigate to="/"/>}/>
                <Route path="/registrar" element={!auth ? <Register /> : <Navigate to="/"/>}/>
              </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;