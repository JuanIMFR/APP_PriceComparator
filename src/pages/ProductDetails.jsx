import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import styles from "./ProductDetails.module.css";
import axios from "axios";

export function ProductDetails() {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [follow, setFollow] = useState(null);
  const puertoActual = window.location.port;
  const [mediamarkt, setMediamarkt] = useState("");
  const [phonehouse, setPhonehouse] = useState("");
  const [worten, setWorten] = useState("");
  const [error, seterror] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (puertoActual === "8000") {
      fetch("http://localhost:8000/api/price/" + productoId)
        .then((result) => result.json())
        .then((data) => {
          setProducto(data.data);
        });
    } else if (puertoActual === "8001") {
      fetch("http://localhost:8001/api/price/" + productoId)
        .then((result) => result.json())
        .then((data) => {
          setProducto(data.data);
        });
    }

    axios
      .post("http://localhost:8000/api/isFollowed", { 'product' : productoId }, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
      .then((response) => {
        if(response.data.follow){
          setFollow('blue');
        }else{
          setFollow('gray');
        }
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }

    function showPosition(position) {
    
      if (puertoActual === "8000") {
        axios
          .post("http://localhost:8000/api/getLocation", { shop: "mediamarkt", longitude: position.coords.longitude, latitude: position.coords.latitude })
          .then((response) => {
            setMediamarkt(response.data);
          });
    
        axios
          .post("http://localhost:8000/api/getLocation", { shop: "phonehouse", longitude: position.coords.longitude, latitude: position.coords.latitude })
          .then((response) => {
            setPhonehouse(response.data);
          });
    
        axios
          .post("http://localhost:8000/api/getLocation", { shop: "worten", longitude: position.coords.longitude, latitude: position.coords.latitude })
          .then((response) => {
            setWorten(response.data);
          });
        }else if (puertoActual === "8001"){
          axios
          .post("http://localhost:8001/api/getLocation", { shop: "mediamarkt", longitude: position.coords.longitude, latitude: position.coords.latitude })
          .then((response) => {
            setMediamarkt(response.data);
          });
    
        axios
          .post("http://localhost:8001/api/getLocation", { shop: "phonehouse", longitude: position.coords.longitude, latitude: position.coords.latitude })
          .then((response) => {
            setPhonehouse(response.data);
          });
    
        axios
          .post("http://localhost:8001/api/getLocation", { shop: "worten", longitude: position.coords.longitude, latitude: position.coords.latitude })
          .then((response) => {
            setWorten(response.data);
          });
        }; 
    }
  }, [productoId]);

  if (!producto) {
    return null;
  }

  const decodeBase64Image = (base64Image) => {
    const imageData = atob(base64Image.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(imageData.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < imageData.length; i++) {
      uintArray[i] = imageData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  };

  const imageUrl = decodeBase64Image(producto.foto);

  function followProduct() {
    axios
      .post("http://localhost:8000/api/follow", { 'product' : productoId }, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
      .then((response) => {
        seterror('');
        if(response.data.follow){
          console.log('pon');
          setFollow('blue');
        }else{
          console.log('quita');
          setFollow('gray');
        }
      }).catch(error => {
        seterror('Necesitas estar logueado para seguir un producto');
      });
  }

  return (
    <div>
      <div><p className="inicioMensaje">{error}</p></div>
      <div className={styles.detailsContainer}>
        <div className={styles.contenedorImg}>
          <img
            className={styles.imagen}
            src={imageUrl}
            alt={producto.nombre}
          />
        </div>
        <div className={styles.contenedorDescrip}>
          <div className={styles.productFlex}>
            <p className={styles.nombre}>{producto.nombre}</p>
            <p className={styles.corazon}><i id="follow" class="fa-solid fa-heart" style={{color : follow}} onClick={followProduct}></i></p>
          </div>
          <p className={styles.descripcion}>{producto.descripcion}</p>
        </div>
      </div>
      <div className={styles.precioM}>
        <div className={styles.Mtitulo}>
          <div className={styles.mediamarktImg} />
        </div>
        <div className={styles.Mprecio}>{producto.precio.MediaMarkt}€</div>
        <div className={styles.Murl}>
          <a href={producto.urls.MediaMarkt}>Comprar</a>
        </div>
        <div className={styles.Murl2}>
          <a href={mediamarkt}>Visitar</a>
        </div>
      </div>
      <div className={styles.precioA}>
        <div className={styles.Mtitulo}>
          <div className={styles.amazonImg}></div>
        </div>
        <div className={styles.Mprecio}>{producto.precio.Amazon}€</div>
        <div className={styles.Murl}>
          <a href={producto.urls.Amazon}>Comprar</a>
        </div>
      </div>
      <div className={styles.precioP}>
        <div className={styles.Mtitulo}>
          <div className={styles.phonehouseImg} />
        </div>
        <div className={styles.Mprecio}>{producto.precio.PhoneHouse}€</div>
        <div className={styles.Murl}>
          <a href={producto.urls.PhoneHouse}>Comprar</a>
        </div>
        <div className={styles.Murl2}>
          <a href={phonehouse}>Visitar</a>
        </div>
      </div>
      <div className={styles.precioW}>
        <div className={styles.Mtitulo}>
          <div className={styles.wortenImg} />
        </div>
        <div className={styles.Mprecio}>{producto.precio.Worten}€</div>
        <div className={styles.Murl}>
          <a href={producto.urls.Worten}>Comprar</a>
        </div>
        <div className={styles.Murl2}>
          <a href={worten}>Visitar</a>
        </div>
      </div>
    </div>
  );
}