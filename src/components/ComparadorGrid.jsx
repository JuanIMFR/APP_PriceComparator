import React, { useEffect, useState } from "react";
import { ProductoCard } from "./ProductoCard";
import { Search } from "./Search";
import { useQuery } from "./../hooks/useQuery";
import styles from "./ComparadorGrid.module.css";
import { useNavigate } from "react-router-dom";

export function ComparadorGrid() {
  const [productos, setProductos] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [cantidadInicial, setCantidadInicial] = useState(15);
  const [error, setError] = useState('');

  const query = useQuery();
  const search = query.get("q");

  const puertoActual = window.location.port;
  const navigate = useNavigate();

  useEffect(() => {
    let apiUrl = "/api/getProducts";
    const params = new URLSearchParams();

    if (search) {
      params.append("q", search);
    }
    if (tipoFiltro) {
      params.append("type", tipoFiltro);
    }

    if (params.toString()) {
      apiUrl += `?${params.toString()}`;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:${puertoActual}${apiUrl}`
        );
        const data = await response.json();
        setProductos(data);
        setError('');
      } catch (error) {
        setProductos([]);
        setError('Ningún producto coincide con la búsqueda');
      }
    };

    fetchData();
  }, [search, tipoFiltro]);

  const handleFiltrarPorTipo = (event) => {
    const tipoSeleccionado = event.target.value;
    setTipoFiltro(tipoSeleccionado);

    const params = new URLSearchParams(window.location.search);
    params.set("type", tipoSeleccionado);

    navigate(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="imgHeader">
        <div className="cuadroAzul">
          <h2 className="nombreEmpresa">BIENVENIDO A TRAZIEM TECHNOLOGY</h2>
          <div className="logotipo2"></div>
        </div>
      </div>
      <div className="frase">
        Los mejores productos tecnológicos
        <br />
        a precios más que lógicos
      </div>
      <div>
        <div className={styles.flexFilters}>
          <div>
            <Search />
          </div>
          <div className={styles.filtroContainer}>
            <select
              value={tipoFiltro}
              onChange={handleFiltrarPorTipo}
              className={styles.filtro}
            >
              <option value="">Todos</option>
              <option value="mobile">Móvil</option>
              <option value="computer">Ordenador</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>
        
        <div><p className="inicioMensaje">{error}</p></div>
        <ul className={styles.comparadorGrid}>
          {productos.slice(0, mostrarTodos ? productos.length : cantidadInicial).map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </ul>

        {!mostrarTodos && productos.length > cantidadInicial && (
          <div class={styles.flex}><button className={styles.verMas} onClick={() => setMostrarTodos(true)}>Ver más</button></div>
        )}
      </div>
    </div>
  );
};