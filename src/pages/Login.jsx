import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      username: usuario,
      password: contraseña
    };
    
    const puertoActual = window.location.port;
    if (puertoActual === "8000") {
      axios.post('http://localhost:8000/api/login', formData)
        .then(response => {
          const token = response.data.access;
          localStorage.setItem('token', token);
          console.log('Inicio de sesión exitoso');
          onLogin();
          navigate('/');
        })
        .catch(error => {
          console.error(error);
        });
    } else if (puertoActual === "8001") {
      axios.post('http://localhost:8001/api/login', formData)
        .then(response => {
          const token = response.data.access;
          localStorage.setItem('token', token);
          console.log('Inicio de sesión exitoso');
          onLogin();
          navigate('/');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <form className="formLogin" onSubmit={handleSubmit}>
        <p className="tituloRegistro">Logueate en Traziem Technology</p>
        <input type="text" className="loginUsuario" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <input type="password" className="loginContrasenia" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
        <input type="submit" className="registroBtn" value="Entrar" />
      </form>
    </div>
  );
};