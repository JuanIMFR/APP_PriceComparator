import React, { useEffect } from "react";
import styles from "./Search.module.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "./../hooks/useQuery";

export function Search(){
    
    const query = useQuery();
    const search = query.get("q");
  
    useEffect(() => {
      setSearchText(search || "");
    }, [search]);

    const [searchText, setSearchText] = useState("");
    const history = useNavigate();
    const handleSubmit = (e) =>{
        e.preventDefault();
        history("/?q=" + searchText);
    }

    return(
        <form className={styles.searchContainer} onSubmit={handleSubmit}>
            <div className={styles.searchBox}>
                <input className={styles.searchInput} type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
                <button className={styles.searchButton} type="submit">
                    <FaSearch size={20}/>
                </button>
            </div>
        </form>
    );
}