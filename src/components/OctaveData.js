import React, { useState, useEffect } from 'react';

import './components.css';

import Loading from './Loading';

const toDate = (intDate) => {
  return new Date(intDate).toLocaleString('de-DE', { dateStyle: 'short' });
};

const OBJECT_ID_API_URL =
  'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=true&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=';

const DATA_API_URL = (untereSchranke, obereSchranke) => {
  return `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=objectId+>%3D+${untereSchranke}+AND+objectId+<+${obereSchranke}&objectIds=&time=&resultType=none&outFields=AnzahlFall%2C+AnzahlTodesfall%2C+AnzahlGenesen%2C+NeuerFall%2C+NeuerTodesfall%2C+NeuGenesen%2C+Meldedatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`;
};

function combineArray(array) {
  let dataArray = [];
  array.map((data) => (dataArray = dataArray.concat(data.features)));
  return dataArray;
}

function sortArrayByMeldedatum(array) {
  let sortedArray = [];
  sortedArray = array.sort(
    (a, b) => a.attributes.Meldedatum - b.attributes.Meldedatum
  );
  return sortedArray;
}

function generateOctaveData(array) {
  let octaveData = [];
  let datum = 0;
  let cummulatedInfected = 0;
  let cummulatedRecovered = 0;
  let cummulatedDeaths = 0;
  let infected = 0;
  let recovered = 0;
  let deaths = 0;
  array.map((element, index, arr) => {
    if (index < arr.length - 1) {
      if (
        arr[index].attributes.Meldedatum ===
        arr[index + 1].attributes.Meldedatum
      ) {
        infected +=
          element.attributes.NeuerFall >= 0 ? element.attributes.AnzahlFall : 0;
        deaths +=
          element.attributes.NeuerTodesfall >= 0
            ? element.attributes.AnzahlTodesfall
            : 0;
        recovered +=
          element.attributes.NeuGenesen >= 0
            ? element.attributes.AnzahlGenesen
            : 0;
      } else {
        infected +=
          element.attributes.NeuerFall >= 0 ? element.attributes.AnzahlFall : 0;
        deaths +=
          element.attributes.NeuerTodesfall >= 0
            ? element.attributes.AnzahlTodesfall
            : 0;
        recovered +=
          element.attributes.NeuGenesen >= 0
            ? element.attributes.AnzahlGenesen
            : 0;
        datum = element.attributes.Meldedatum;
        cummulatedInfected += infected;
        cummulatedDeaths += deaths;
        cummulatedRecovered += recovered;
        //Speichere die Were in Array
        octaveData.push({
          cummulatedInfected: cummulatedInfected,
          cummulatedRecovered: cummulatedRecovered,
          cummulatedDeaths: cummulatedDeaths,
          infected: infected,
          recovered: recovered,
          deaths: deaths,
          date: datum,
        });
        //setze zurück auf 0
        infected = 0;
        deaths = 0;
        recovered = 0;
      }
    } else {
      infected +=
        element.attributes.NeuerFall >= 0 ? element.attributes.AnzahlFall : 0;
      deaths +=
        element.attributes.NeuerTodesfall >= 0
          ? element.attributes.AnzahlTodesfall
          : 0;
      recovered +=
        element.attributes.NeuGenesen >= 0
          ? element.attributes.AnzahlGenesen
          : 0;
      datum = element.attributes.Meldedatum;
      cummulatedInfected += infected;
      cummulatedDeaths += deaths;
      cummulatedRecovered += recovered;
      //Speichere die Were in Array
      octaveData.push({
        cummulatedInfected: cummulatedInfected,
        cummulatedRecovered: cummulatedRecovered,
        cummulatedDeaths: cummulatedDeaths,
        infected: infected,
        recovered: recovered,
        deaths: deaths,
        date: datum,
      });
    }
  });
  return octaveData;
}

export default function Data() {
  const [loading, setLoading] = useState(false);
  const [coronaData, setCoronaData] = useState([]);
  const [coronaOctaveData, setCoronaOctaveData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let fetchedCoronaData = [];
      let result = await fetch(OBJECT_ID_API_URL);
      let data = await result.json();
      const maxSchranke = data.objectIds[data.objectIds.length - 1] - 1;
      const fetchCycles = Math.ceil(data.objectIds.length / 5000);
      for (let cycle = 0; cycle < fetchCycles; cycle++) {
        let untereSchranke = data.objectIds[cycle * 5000];
        let obereSchranke =
          untereSchranke + 5000 < maxSchranke
            ? untereSchranke + 5000
            : maxSchranke;
        let res = await fetch(DATA_API_URL(untereSchranke, obereSchranke));
        let d = await res.json();
        fetchedCoronaData.push(d);
      }
      setCoronaData(sortArrayByMeldedatum(combineArray(fetchedCoronaData)));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (coronaData.length > 0) {
      setCoronaOctaveData(generateOctaveData(coronaData));
      setLoading(false);
    }
  }, [coronaData]);
  if (coronaData.length > 0) console.log(coronaData);
  if (coronaOctaveData.length > 0) console.log(coronaOctaveData);

  return (
    <div className="comp">
      {loading ? (
        <Loading />
      ) : (
        <div className="comp-octave">
          <code className="octave-comments">
            ## Copyright (C) 2020 Christoph Pfaffmann
          </code>
          <code className="octave-comments">## </code>
          <code className="octave-comments">
            ## This program is free software: you can redistribute it and/or
            modify it
          </code>
          <code className="octave-comments">
            ## under the terms of the GNU General Public License as published by
          </code>
          <code className="octave-comments">
            ## the Free Software Foundation, either version 3 of the License, or
          </code>
          <code className="octave-comments">
            ## (at your option) any later version.
          </code>
          <code className="octave-comments">## </code>
          <code className="octave-comments">
            ## This program is distributed in the hope that it will be useful,
            but
          </code>
          <code className="octave-comments">
            ## WITHOUT ANY WARRANTY; without even the implied warranty of
          </code>
          <code className="octave-comments">
            ## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
          </code>
          <code className="octave-comments">
            ## GNU General Public License for more details.
          </code>
          <code className="octave-comments">## </code>
          <code className="octave-comments">
            ## You should have received a copy of the GNU General Public License
          </code>
          <code className="octave-comments">
            ## along with this program. If not, see
          </code>
          <code className="octave-comments">
            ##{' '}
            <a
              className="octave-comments"
              href="https://www.gnu.org/licenses/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.gnu.org/licenses/
            </a>
            .
          </code>
          <code className="octave-comments">
            ## Author: Christoph Pfaffmann{' '}
          </code>
          <code className="octave-comments">## Created: 2020-05-02</code>
          <code>
            <span className="octave-function">function</span> <span>y</span>{' '}
            <span className="octave-symbols">=</span> <span>coronaData</span>{' '}
            <span className="octave-symbols">()</span>
          </code>

          <code className="comp-octave-tab">
            <span>infects </span>
            <span className="octave-symbols">= [</span>
            {coronaOctaveData.map((data) => (
              <span>
                <span className="octave-numbers">
                  {data.cummulatedInfected}
                </span>
                <span className="octave-symbols">, </span>
              </span>
            ))}
            <span className="octave-symbols">];</span>
          </code>
          <code className="comp-octave-tab">
            <span>deads </span>
            <span className="octave-symbols">= [</span>
            {coronaOctaveData.map((data) => (
              <span>
                <span className="octave-numbers">{data.cummulatedDeaths}</span>
                <span className="octave-symbols">, </span>
              </span>
            ))}
            <span className="octave-symbols">];</span>
          </code>
          <code className="comp-octave-tab">
            <span>recovered </span>
            <span className="octave-symbols">= [</span>
            {coronaOctaveData.map((data) => (
              <span>
                <span className="octave-numbers">
                  {data.cummulatedRecovered}
                </span>
                <span className="octave-symbols">, </span>
              </span>
            ))}
            <span className="octave-symbols">];</span>
          </code>

          <code className="comp-octave-tab">
            <span>y</span> <span className="octave-symbols">= [</span>
            <span>infects</span>
            <span className="octave-symbols">;</span>
            <span>deads</span>
            <span className="octave-symbols">;</span>
            <span>recovered</span>
            <span className="octave-symbols">];</span>
          </code>
          <code className="octave-function">endfunction</code>
        </div>
      )}
    </div>
  );
}
