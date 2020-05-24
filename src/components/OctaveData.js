import React, { useState } from "react";
import "./components.css";

import Loading from "./Loading";

const testData = {
  attributes: [
    {
      AnzahlFall: 2,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800002,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 1,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800001,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 2,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800002,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 6,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800006,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 3,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800003,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 4,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800004,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 6,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800006,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 5,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800005,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 2,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800002,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 6,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800006,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 7,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800007,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 8,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800008,
      AnzahlGenesen: 1,
    },
    {
      AnzahlFall: 6,
      AnzahlTodesfall: 0,
      Meldedatum: 1584748800006,
      AnzahlGenesen: 1,
    },
  ],
};

const testDataArray = [testData, testData, testData];
sortData(testDataArray);

function sortData(dataArr) {
  console.log(dataArr);
  const dataSorted = dataArr.map((data) =>
    data.attributes.sort((a, b) => a.Meldedatum - b.Meldedatum)
  );
  console.log(dataSorted);
}
const dataSchema = {
  cummulatedInfected: 0,
  infected: 0,
  recovered: 0,
  dead: 0,
  date: null,
};

const data = [dataSchema, dataSchema]; //für jeden Tag einen Array Eintrag

export default function Data() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="comp">{loading ? <Loading /> : <h1>Octave Data</h1>}</div>
  );
}
