import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function CrearProducto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [tipo, setTipo] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8000/api/isAdmin', {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8',
          },
        })
        .then((response) => {
          setIsAdmin(response.data === 'ok');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setMostrarMensaje(true);
      return;
    }

    if (imagen) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result;
        const formData = {
          name: nombre,
          description: descripcion,
          image: base64Image,
          type: tipo,
        };

        const token = localStorage.getItem('token');
        if (token) {
          axios
            .post('http://localhost:8000/api/createProduct', formData, {
              headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json;charset=utf-8',
              },
            })
            .then((response) => {
              console.log(response);
              console.log('Producto creado exitosamente');
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };

      reader.readAsDataURL(imagen);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImagen(file);
  };

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  return (
    <div>
      {mostrarMensaje && !isAdmin && (
        <div><p className="inicioMensaje">Necesitas ser administrador para crear productos</p></div>
      )}
      <form className="formRegistro" onSubmit={handleSubmit}>
        <p className="tituloRegistro">Crear Producto</p>
        <input
          type="text"
          className="registroNombre"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          className="registroApellido"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <select value={tipo} onChange={handleTipoChange} name="tipo" className='registroTipo'>
          <option value="0">Tipo</option>
          <option value="1">Móvil</option>
          <option value="2">Ordenador</option>
          <option value="3">Tablet</option>
        </select>
        <input
          type="file"
          className="registroImagen"
          name="imagen"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input type="submit" className="registroBtn" />
      </form>
    </div>
  );
};