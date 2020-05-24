import React, { useState, useEffect } from 'react';
import FullDataTable from './components/FullDataTable';
import './App.css';
import Button from '@material-ui/core/Button';

const OBJECT_ID_API_URL =
  'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=true&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=';

const coronaDataSchema = {
  objectIdFieldName: 'defew',
  uniqueIdField: { a: 'fefwef', b: 'frrg' },
  globalIdFieldName: 'fwefwef',
  fields: [1, 2, 3, 4, 5, 6],
  exceededTransferLimit: false,
  features: [1, 2, 3, 4, 5, 6, 7, 8],
};

const test = [coronaDataSchema, coronaDataSchema, coronaDataSchema];

function App() {
  const [loading, setLoading] = useState(false);
  const [coronaData, setCoronaData] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);
  const [objectIds, setObjectIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let result = await fetch(OBJECT_ID_API_URL);
      let data = await result.json();
      setObjectIds(data.objectIds); //optional
      const maxSchranke = data.objectIds[data.objectIds.length - 1] - 1;
      const fetchCycles = Math.ceil(data.objectIds.length / 5000);
      //console.log(fetchCycles);
      for (let cycle = 0; cycle < fetchCycles; cycle++) {
        let untereSchranke = data.objectIds[cycle * 5000];
        let obereSchranke =
          untereSchranke + 5000 < maxSchranke
            ? untereSchranke + 5000
            : maxSchranke;
        //console.log(`untere Schranke: ${untereSchranke}`);
        //console.log(`obere  Schranke: ${obereSchranke}`);

        let res = await fetch(
          `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=objectId+>%3D+${untereSchranke}+AND+objectId+<+${obereSchranke}&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`
        );
        let d = await res.json();
        //console.log(d);
        coronaData.push(d);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   const fetchData = async () => {
  //     const result = await fetch(
  //       `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=objectId+>%3D+${8389849}+AND+objectId+<+${8389949}&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson`
  //     );
  //     console.log(result);
  //     const data = await result.json();
  //     setCoronaData(data);
  //     console.log(data);
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);
  // console.log(test);
  // let i = 1;
  // test.map((t) =>
  //   t.fields.map((x) => {
  //     console.log(i++);
  //   })
  // );

  return (
    <div className="App">
      <div className="App-header">
        {loading ? <h1>loading...</h1> : <h1>Corona-Data</h1>}
      </div>
      <div className="App-buttons">
        <Button variant="outlined" color="primary">
          Daten anzeigen
        </Button>
        <Button variant="outlined" color="primary">
          Octave Daten erzeugen
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            console.log(coronaData);
            setShowDataTable(true);
          }}
        >
          Alle Daten anzeigen
        </Button>
      </div>
      {coronaData.length > 0 && showDataTable ? (
        <div className="App-table">
          <FullDataTable data={coronaData}></FullDataTable>
        </div>
      ) : null}
    </div>
  );
}

export default App;
