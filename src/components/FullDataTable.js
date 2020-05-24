import React, { useState } from 'react';
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

function valuetext(value) {
  return `S. ${value}`;
}

export default function FullDataTable(props) {
  const classes = useStyles();
  const coronaData = props.data;
  const [notShowData, setNotShowData] = useState(true);
  const [page, setPage] = useState(1);
  const anzData =
    (coronaData.length - 1) * 5000 +
    coronaData[coronaData.length - 1].features.length;

  return (
    <div>
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
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setNotShowData(false)}
        >
          Zeilen anzeigen
        </Button>
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
                  <TableCell>{feature.attributes.AnzahlTodesfall}</TableCell>
                  <TableCell>{feature.attributes.ObjectId}</TableCell>
                  <TableCell>{toDate(feature.attributes.Meldedatum)}</TableCell>
                  <TableCell>{feature.attributes.IdLandkreis}</TableCell>
                  <TableCell>{feature.attributes.Datenstand}</TableCell>
                  <TableCell>{feature.attributes.NeuerFall}</TableCell>
                  <TableCell>{feature.attributes.NeuerTodesfall}</TableCell>
                  <TableCell>{toDate(feature.attributes.Refdatum)}</TableCell>
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
  );
}
