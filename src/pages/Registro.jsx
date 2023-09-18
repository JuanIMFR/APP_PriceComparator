import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function Registro() {
  const history = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    const { nombre, apellidos, email, usuario, contraseña } = event.target.elements;

    const formData = {
      first_name: nombre.value,
      last_name: apellidos.value,
      email: email.value,
      username: usuario.value,
      password: contraseña.value
    };

    const puertoActual = window.location.port;
    if (puertoActual === "8000"){
      axios.post('http://localhost:8000/api/register', formData)
      .then(response => {
        console.log(response.data);
        const loginData = {
          username: usuario.value,
          password: contraseña.value
        };
        return axios.post('http://localhost:8000/api/login', loginData);
      })
      .then(response => {
        const token = response.data.access;
        localStorage.setItem('token', token);
        console.log('Inicio de sesión exitoso');
        history('/');
      })
      .catch(error => {
        console.error(error);
      });
    }else if(puertoActual === "8001"){
      axios.post('http://localhost:8001/api/register', formData)
      .then(response => {
        console.log(response.data);
        const loginData = {
          username: usuario.value,
          password: contraseña.value
        };
        return axios.post('http://localhost:8001/api/login', loginData);
      })
      .then(response => {
        const token = response.data.access;
        localStorage.setItem('token', token);
        console.log('Inicio de sesión exitoso');
        history('/');
      })
      .catch(error => {
        console.error(error);
      });
    }
    
  };

  return (
    <div>
      <form className="formRegistro" onSubmit={handleSubmit}>
        <p className="tituloRegistro">Registrate en Traziem Technology</p>
        <input type="text" className="registroNombre" placeholder="Nombre" name="nombre" />
        <input type="text" className="registroApellido" placeholder="Apellidos" name="apellidos" />
        <input type="email" className="registroEmail" placeholder="Email" name="email" />
        <input type="text" className="registroUsuario" placeholder="Usuario" name="usuario" />
        <input type="text" className="registroContrasenia" placeholder="Contraseña" name="contraseña" />
        <input type="submit" className="registroBtn" value="Registrar" />
      </form>
    </div>
  );
}