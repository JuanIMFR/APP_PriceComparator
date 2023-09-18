import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProductDetails } from './pages/ProductDetails';
import { LandingPages } from './pages/LandingPages';
import { Aviso } from './pages/Aviso';
import { Privacidad } from './pages/Privacidad';
import { Cookies } from './pages/Cookies';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { CrearProducto } from './pages/CrearProducto';
import axios from "axios";


export function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const puertoActual = window.location.port;
  

  useEffect(() => {
    axios
      .get("http://localhost:" + puertoActual + "/api/isAdmin", {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
      .then((response) => {
        setIsAdmin(true);
      })
      .catch(error =>{
        setIsAdmin(false);
      });
  }, [token, puertoActual]);

  const handleLogin = () => {
    setToken(localStorage.getItem('token'));
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  const renderCrearProductoButton = () => {
    if (isAdmin) {
      return (
        <Link to="/crearProducto" className="createProduct">
          Crear Producto
        </Link>
      );
    }
    return null;
  };

  return (
    <Router>
      <header className="navi">
        <Link to="/">
          <div className="logotipo"></div>
        </Link>
        <div className="urlsNav">
          {renderCrearProductoButton()}
          {isAdmin || token ? (
            <a onClick={handleLogout} className="navHome3">
              Logout
            </a>
          ) : (
            <React.Fragment>
              <Link to="/login" className="navHome">
                Login
              </Link>
              <Link to="/registro" className="navRegistro">
                Registro
              </Link>
            </React.Fragment>
          )}
        </div>
      </header>
      <Routes>
        <Route exact path="/producto/:productoId" element={<ProductDetails />} />
        <Route
          exact
          path="/crearProducto"
          element={<CrearProducto isAdmin={isAdmin} />}
        />
        <Route path="/" element={<LandingPages />} />
        <Route path="/aviso" element={<Aviso />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
      <footer className="footer">
        <div className="flex3">
          <div className="izqLogo">
            <Link to="/">
              <div className="logotipo3"></div>
            </Link>
          </div>
          <div className="derechaNAV">
            {isAdmin || token ? (
              <a onClick={handleLogout} className="navRegistro2">
                Logout
              </a>
            ) : (
              <React.Fragment>
                <Link to="/login" className="navHome2">
                  Login
                </Link>
                <Link to="/registro" className="navRegistro2">
                  Registro
                </Link>
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="separador"></div>
        <div className="flex">
          <Link to="/aviso" class="aviso">
            Aviso Legal
          </Link>
          <Link to="/privacidad" class="privacidad">
            Política de privacidad
          </Link>
          <Link to="/cookies" class="cookies">
            Política de cookies
          </Link>
        </div>
      </footer>
    </Router>
  );
};