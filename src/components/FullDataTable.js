import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Loading from './Loading';
import './components.css';

const OBJECT_ID_API_URL =
  'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=true&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=';

const DATA_API_URL = (untereSchranke, obereSchranke) => {
  return `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=objectId+>%3D+${untereSchranke}+AND+objectId+<+${obereSchranke}&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`;
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  slider: {
    width: 300,
  },
  table: {
    minWidth: 650,
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const toDate = (intDate) => {
  return new Date(intDate).toLocaleString('de-DE', { dateStyle: 'short' });
};

function valuetext(value) {
  return `S. ${value}`;
}

// function combineArray(array) {
//   let dataArray = [];
//   array.map((data) => (dataArray = dataArray.concat(data.features)));
//   return dataArray;
// }

export default function FullDataTable() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [coronaData, setCoronaData] = useState([]);
  const [notShowData, setNotShowData] = useState(true);
  //const [objectIds, setObjectIds] = useState([]);
  const [page, setPage] = useState(1);
  const [anzData, setAnzData] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotShowData(false);
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let coronaDataTmp = [];
      let result = await fetch(OBJECT_ID_API_URL);
      let data = await result.json();
      //setObjectIds(data.objectIds); //optional
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

        let res = await fetch(DATA_API_URL(untereSchranke, obereSchranke));
        let d = await res.json();
        //console.log(d);
        coronaDataTmp.push(d);
      }
      setCoronaData(coronaDataTmp);
      //console.log(coronaDataTmp);
      //const allData = combineArray(coronaDataTmp);
      //console.log(allData);
      setAnzData(
        (coronaDataTmp.length - 1) * 5000 +
          coronaDataTmp[coronaDataTmp.length - 1].features.length
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="comp">
          <p>
            Zeilen: {(page - 1) * 5000} bis{' '}
            {page * 5000 < anzData ? page * 5000 : anzData} von {anzData}
          </p>
          <div className={classes.slider}>
            <Typography id="discrete-slider" gutterBottom>
              Seite: {page}
            </Typography>
            <Slider
              defaultValue={page}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={coronaData.length}
              onChange={(e, value) => {
                setPage(value);
                setNotShowData(true);
              }}
            />
          </div>
          {notShowData ? (
            <div className={classes.root}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  handleClick();
                  //setNotShowData(false);
                }}
              >
                Zeilen anzeigen
              </Button>
              <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="info">
                  Tabelle wird erstellt. Dies kann sehr lange dauern.
                </Alert>
              </Snackbar>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {coronaData[0].fields.map((field) => (
                      <TableCell>{field.name}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coronaData[page - 1].features.map((feature) => (
                    <TableRow key={feature.attributes.ObjectId}>
                      <TableCell>{feature.attributes.IdBundesland}</TableCell>
                      <TableCell>{feature.attributes.Bundesland}</TableCell>
                      <TableCell>{feature.attributes.Landkreis}</TableCell>
                      <TableCell>{feature.attributes.Altersgruppe}</TableCell>
                      <TableCell>{feature.attributes.Geschlecht}</TableCell>
                      <TableCell>{feature.attributes.AnzahlFall}</TableCell>
                      <TableCell>
                        {feature.attributes.AnzahlTodesfall}
                      </TableCell>
                      <TableCell>{feature.attributes.ObjectId}</TableCell>
                      <TableCell>
                        {toDate(feature.attributes.Meldedatum)}
                      </TableCell>
                      <TableCell>{feature.attributes.IdLandkreis}</TableCell>
                      <TableCell>{feature.attributes.Datenstand}</TableCell>
                      <TableCell>{feature.attributes.NeuerFall}</TableCell>
                      <TableCell>{feature.attributes.NeuerTodesfall}</TableCell>
                      <TableCell>
                        {toDate(feature.attributes.Refdatum)}
                      </TableCell>
                      <TableCell>{feature.attributes.NeuGenesen}</TableCell>
                      <TableCell>{feature.attributes.AnzahlGenesen}</TableCell>
                      <TableCell>
                        {feature.attributes.IstErkrankungsbeginn}
                      </TableCell>
                      <TableCell>{feature.attributes.Altersgruppe2}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </div>
  );
}
