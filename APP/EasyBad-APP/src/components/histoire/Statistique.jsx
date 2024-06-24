import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const StatsComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3200/stats")
      .then((response) => setData(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des statistiques", error)
      );
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { victoires, morts, bienRepondu, malRepondu, fini, total, sections } =
    data;

  const pieData1 = [
    ["Statut", "Nombre"],
    ["Victoires", victoires],
    ["Morts", morts],
  ];

  const pieData2 = [
    ["Statut", "Nombre"],
    ["Bonne réponse", bienRepondu],
    ["Mauvaise réponse", malRepondu],
  ];
  const pieData3 = [
    ["Statut", "Nombre"],
    ["Finis", fini],
    ["Non finis", total - fini],
  ];

  const barData = [
    ["Section", "Nombre de joueurs"],
    ...sections.map((section) => [section.section, section.count]),
  ];

  return (
    <div style={{width:"1000px", backgroundColor:"#FBEBD2", borderRadius:"50px"}}>
      <h1 style={{color:"black"}}>Statistiques du Jeu</h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Chart
          width={"600px"}
          height={"400px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pieData1}
          options={{
            title: "Victoires vs Morts",
            pieHole: 0.4,
            backgroundColor: 'transparent',
            legend: {
              textStyle: { color: 'black' }
            },
            chartArea: {
              textStyle: { color: 'black' }
            },
            pieSliceTextStyle: {
              color: 'black'
            }
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Chart
          width={"600px"}
          height={"400px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pieData2}
          options={{
            title: "joueurs ayant bien répondu à la question",
            pieHole: 0.4,
            backgroundColor: 'transparent',
            legend: {
              textStyle: { color: 'black' }
            },
            chartArea: {
              textStyle: { color: 'black' }
            },
            pieSliceTextStyle: {
              color: 'black'
            }
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Chart
          width={"600px"}
          height={"400px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pieData3}
          options={{
            title: "joueurs ayant fini le jeu",
            pieHole: 0.4,
            backgroundColor: 'transparent',
            legend: {
              textStyle: { color: 'black' }
            },
            chartArea: {
              textStyle: { color: 'black' }
            },
            pieSliceTextStyle: {
              color: 'black'
            }
          }}
        />
      </div>

      <Chart
        width={"100%"}
        height={"300px"}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={barData}
        options={{
          title: "Nombre de joueurs par section",
          chartArea: { width: "70%" },
          backgroundColor: 'transparent',
          hAxis: {
            title: "Nombre de joueurs",
            minValue: 0,
          },
          vAxis: {
            title: "Section",
          },
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        }}
      />
    </div>
  );
};

export default StatsComponent;
