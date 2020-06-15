import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './components.css';

import {
  generateOctaveData,
  toDate,
  sortArrayByMeldedatum,
} from '../functions';

import Loading from './Loading';

const useStyles = makeStyles({
  slider: {
    width: 300,
  },
  table: {
    minWidth: 650,
  },
});

export default function Data() {
  const [loading, setLoading] = useState(false);
  const [coronaData, setCoronaData] = useState([]);
  const [coronaOctaveData, setCoronaOctaveData] = useState([]);
  const { data } = useStoreState((state) => state.coronaData);

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    setCoronaData(sortArrayByMeldedatum(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (coronaData.length > 0) {
      setLoading(true);
      setCoronaOctaveData(generateOctaveData(coronaData));
      setLoading(false);
    }
  }, [coronaData]);

  return (
    <div className="comp">
      {loading ? (
        <Loading />
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fälle</TableCell>
                <TableCell>Genesene</TableCell>
                <TableCell>Gestorbene</TableCell>
                <TableCell>Fälle am Tag</TableCell>
                <TableCell>Genesene am Tag</TableCell>
                <TableCell>Gestorbene am Tag</TableCell>
                <TableCell>Datum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coronaOctaveData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.cummulatedCases}</TableCell>
                  <TableCell>{row.cummulatedRecovered}</TableCell>
                  <TableCell>{row.cummulatedDeaths}</TableCell>
                  <TableCell>{row.cases}</TableCell>
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
