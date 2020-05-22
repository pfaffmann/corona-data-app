import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const toDate = (intDate) => {
  return new Date(intDate).toLocaleString('de-DE', { dateStyle: 'short' });
};

export default function DataTable(props) {
  const classes = useStyles();
  const data = props.data;

  return (
    <>
      {/* <div>{data.features[1].attributes.Meldedatum}</div>
      <div>{toDate(data.features[1].attributes.Meldedatum)}</div> */}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Bundesland</TableCell>
              <TableCell>Landkreis</TableCell>
              <TableCell>Altersgruppe</TableCell>
              <TableCell>Geschlecht</TableCell>
              <TableCell>Anzahl Fall</TableCell>
              <TableCell>Anzahl Todesfall</TableCell>
              <TableCell>Meldedatum</TableCell>
              <TableCell>Anzahl Genesenen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.features.map((feature) => (
              <TableRow key={feature.attributes.ObjectId}>
                {/* <TableCell>{feature.attributes.IdBundesland}</TableCell> */}
                <TableCell>{feature.attributes.Bundesland}</TableCell>
                <TableCell>{feature.attributes.Landkreis}</TableCell>
                <TableCell>{feature.attributes.Altersgruppe}</TableCell>
                <TableCell>{feature.attributes.Geschlecht}</TableCell>
                <TableCell>{feature.attributes.AnzahlFall}</TableCell>
                <TableCell>{feature.attributes.AnzahlTodesfall}</TableCell>
                {/* <TableCell>{feature.attributes.ObjectId}</TableCell> */}
                <TableCell>{toDate(feature.attributes.Meldedatum)}</TableCell>
                {/* <TableCell>{feature.attributes.IdLandkreis}</TableCell> */}
                {/* <TableCell>{feature.attributes.Datenstand}</TableCell> */}
                {/* <TableCell>{feature.attributes.NeuerFall}</TableCell> */}
                {/* <TableCell>{feature.attributes.NeuerTodesfall}</TableCell> */}
                {/* <TableCell>{toDate(feature.attributes.Refdatum)}</TableCell> */}
                {/* <TableCell>{feature.attributes.NeuGenesen}</TableCell> */}
                <TableCell>{feature.attributes.AnzahlGenesen}</TableCell>
                {/* <TableCell>{feature.attributes.IstErkrankungsbeginn}</TableCell> */}
                {/* <TableCell>{feature.attributes.Altersgruppe2}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
