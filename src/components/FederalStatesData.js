import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

function sortArrayByMeldedatum(array) {
  let sortedArray = [];
  sortedArray = array.sort(
    (a, b) => a.attributes.Meldedatum - b.attributes.Meldedatum
  );
  return sortedArray;
}
function filterArrayByFederalStateId(array, id) {
  let filteredArray = [];
  filteredArray = array.filter((a) => a.attributes.IdBundesland === id);
  return filteredArray;
}
function getFederalStateObject(array) {
  let federalStateArray = [];
  const sortedArray = sortArrayByMeldedatum(array);
  const minMeldedatum = sortedArray[0].attributes.Meldedatum;
  const maxMeldedatum =
    sortedArray[sortedArray.length - 1].attributes.Meldedatum;
  const einTagInMs = 60 * 60 * 24 * 1000;
  const anzahlTage = (maxMeldedatum - minMeldedatum) / einTagInMs;
  console.log(
    `Min: ${minMeldedatum} Max: ${maxMeldedatum} Tage: ${anzahlTage}`
  );
  for (let i = 1; i <= 16; i++) {
    federalStateArray.push(
      sortArrayByMeldedatum(filterArrayByFederalStateId(array, i))
    );
  }
  return { federalStateArray, minMeldedatum, maxMeldedatum };
}
function generateOctaveData(array) {
  let octaveData = [];
  let datum = 0;
  let cummulatedCases = 0;
  let cummulatedRecovered = 0;
  let cummulatedDeaths = 0;
  let cases = 0;
  let recovered = 0;
  let deaths = 0;
  array.map((element, index, arr) => {
    if (index < arr.length - 1) {
      if (
        arr[index].attributes.Meldedatum ===
        arr[index + 1].attributes.Meldedatum
      ) {
        cases +=
          element.attributes.NeuerFall === 0 ||
          element.attributes.NeuerFall === 1
            ? element.attributes.AnzahlFall
            : 0;
        deaths +=
          element.attributes.NeuerTodesfall === 0 ||
          element.attributes.NeuerTodesfall === 1
            ? element.attributes.AnzahlTodesfall
            : 0;
        recovered +=
          element.attributes.NeuGenesen === 0 ||
          element.attributes.NeuGenesen === 1
            ? element.attributes.AnzahlGenesen
            : 0;
      } else {
        cases +=
          element.attributes.NeuerFall === 0 ||
          element.attributes.NeuerFall === 1
            ? element.attributes.AnzahlFall
            : 0;
        deaths +=
          element.attributes.NeuerTodesfall === 0 ||
          element.attributes.NeuerTodesfall === 1
            ? element.attributes.AnzahlTodesfall
            : 0;
        recovered +=
          element.attributes.NeuGenesen === 0 ||
          element.attributes.NeuGenesen === 1
            ? element.attributes.AnzahlGenesen
            : 0;
        datum = element.attributes.Meldedatum;
        cummulatedCases += cases;
        cummulatedDeaths += deaths;
        cummulatedRecovered += recovered;
        //Speichere die Were in Array
        octaveData.push({
          cummulatedCases,
          cummulatedRecovered,
          cummulatedDeaths,
          cases,
          recovered,
          deaths,
          date: datum,
        });
        //setze zurück auf 0
        cases = 0;
        deaths = 0;
        recovered = 0;
      }
    } else {
      cases +=
        element.attributes.NeuerFall === 0 || element.attributes.NeuerFall === 1
          ? element.attributes.AnzahlFall
          : 0;
      deaths +=
        element.attributes.NeuerTodesfall === 0 ||
        element.attributes.NeuerTodesfall === 1
          ? element.attributes.AnzahlTodesfall
          : 0;
      recovered +=
        element.attributes.NeuGenesen === 0 ||
        element.attributes.NeuGenesen === 1
          ? element.attributes.AnzahlGenesen
          : 0;
      datum = element.attributes.Meldedatum;
      cummulatedCases += cases;
      cummulatedDeaths += deaths;
      cummulatedRecovered += recovered;
      //Speichere die Were in Array
      octaveData.push({
        cummulatedCases,
        cummulatedRecovered,
        cummulatedDeaths,
        cases,
        recovered,
        deaths,
        date: datum,
      });
    }
  });
  return octaveData;
}

function reduceFederalStateArray(object) {
  const { federalStateArray, minMeldedatum, maxMeldedatum } = object;
  let reducedArray = [];
  federalStateArray.map((federalArray) => {
    let length = 0;
    reducedArray.push(generateOctaveData(federalArray));
    length = reducedArray.length;
  });
  return { reducedArray, minMeldedatum, maxMeldedatum };
}

function expandFederalStateObject(object) {
  const expandedArray = [];
  const { reducedArray, minMeldedatum, maxMeldedatum } = object;
  const dayInMs = 24 * 60 * 60 * 1000;
  const anzahlTage = (maxMeldedatum - minMeldedatum) / dayInMs;
  reducedArray.map((element) => {
    let length = element.length;
    while (length <= anzahlTage) {
      element.push({ date: length });
      length = element.length;
    }
  });
  let emptyArray = [anzahlTage + 1];
  const emptyEntry = {
    cases: 0,
    deaths: 0,
    recovered: 0,
    cummulatedCases: 0,
    cummulatedDeaths: 0,
    cummulatedRecovered: 0,
    nodata: true,
  };
  for (let i = 0; i <= anzahlTage; i++) {
    emptyArray[i] = { ...emptyEntry, date: minMeldedatum + i * dayInMs };
  }
  reducedArray.map((reduced, index) => {
    for (let i = 0; i < reduced.length; i++) {
      for (let j = 0; j < emptyArray.length; j++) {
        if (emptyArray[j].date === reduced[i].date) {
          emptyArray[j] = reduced[i];
        }
      }
    }
    expandedArray.push(emptyArray);
  });
  return expandedArray;
}

export default function FederalStateDate() {
  const [federalCoronaData, setFederalCoronaData] = useState([]);
  const { data } = useStoreState((state) => state.coronaData);
  useEffect(() => {
    console.log(
      expandFederalStateObject(
        reduceFederalStateArray(getFederalStateObject(data))
      )
    );
  }, []);
  return null;
}
