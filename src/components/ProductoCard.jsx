import { Link } from "react-router-dom";
import styles from "./ProductoCard.module.css";

export function ProductoCard({ producto }) {
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

  const imageUrl = decodeBase64Image(producto.image);

  return (
    <li className={styles.productoCard}>
      <Link to={"/producto/" + producto.id}>
        <div className={styles.tarjeta}>
          <div className={styles.contenedorImg}>
            <img className={styles.imagen} src={imageUrl} alt={producto.name} />
          </div>
          <div className={styles.nombre}>{producto.name}</div>
        </div>
      </Link>
    </li>
  );
}