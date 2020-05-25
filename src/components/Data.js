import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './components.css';

import Loading from './Loading';

const useStyles = makeStyles({
  slider: {
    width: 300,
  },
  table: {
    minWidth: 650,
  },
});

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

  const classes = useStyles();

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
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Infizierte</TableCell>
                <TableCell>Genesene</TableCell>
                <TableCell>Gestorbene</TableCell>
                <TableCell>Infizierte am Tag</TableCell>
                <TableCell>Genesene am Tag</TableCell>
                <TableCell>Gestorbene am Tag</TableCell>
                <TableCell>Datum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coronaOctaveData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.cummulatedInfected}</TableCell>
                  <TableCell>{row.cummulatedRecovered}</TableCell>
                  <TableCell>{row.cummulatedDeaths}</TableCell>
                  <TableCell>{row.infected}</TableCell>
                  <TableCell>{row.recovered}</TableCell>
                  <TableCell>{row.deaths}</TableCell>
                  <TableCell>{toDate(row.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
