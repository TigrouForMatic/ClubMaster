import React, { useState, useEffect } from "react";
// import axios from "axios";
import MainComponent from "../histoire/MainQuestComponent";

function LibraryQuestComponent() {

  const [histoires, setHistoires] = useState([]);

  useEffect(() => {
    const histoireList = [
      {id: 1, nom: "Cayden Quest", id_user : 1, private : false},
      {id: 2, nom: "Rayden Quest", id_user : 1, private : false},
      {id: 3, nom: "Jayden Quest", id_user : 1, private : false},
      {id: 4, nom: "Mayden Quest", id_user : 1, private : true},
      {id: 5, nom: "Layden Quest", id_user : 1, private : true},
    ]

    setHistoires(histoireList);
    // A ajouter quand la route et la BDD seront créés
    // const fetchData = async () => {
    //   try {
    //     const [
    //       histoires
    //     ] = await Promise.all([
    //       axios.get("http://localhost:3200/histoires")
    //     ]);
    //     setHistoires(histoires.data);
    //   } catch (error) {
    //     console.error("Erreur lors de la récupération des données :", error);
    //   }
    // };
    // fetchData();
  }, []);

  const listHistoiresCommunautaires = () => {
    return histoires.find(hist => hist.private == false)
  }

  const listHistoiresPersonnelles = () => {
    return histoires.find(hist => hist.private == true)
  }

  const BlockAccueil = ({ title, stories }) => (
    <div className='blockAccueil'>
      <h1>{title}</h1>
      <ul>
        {stories.map((histoire, index) => (
          <li key={index}>{histoire}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* <BlockAccueil title="Histoires Communautaires" stories={communautaires} />
      <BlockAccueil title="Histoires Personnelles" stories={personnelles} /> */}
      <MainComponent />
    </>
  );
}

export default LibraryQuestComponent;