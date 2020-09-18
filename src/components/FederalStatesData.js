import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { toDate } from '../functions';
import { createFederalCoronaData } from '../functions/federalState.js';
import './components.css';

function createOctaveString(federalCoronaData) {
  const today = new Date();
  const comment = `## Copyright (C) ${today.getFullYear()} Christoph Pfaffmann
##
## This program is free software: you can redistribute it and/or modify it
## under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or
## (at your option) any later version.\n##\n## This program is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
## GNU General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with this program. If not, see
## https://www.gnu.org/licenses/.
## Author: Christoph Pfaffmann
## Created: ${toDate(today)}`;

  let cummulatedCasesString = 'cummulatedCases=[';
  let cummulatedDeathsString = 'cummulatedDeaths=[';
  let cummulatedRecoveredString = 'cummulatedRecovered=[';
  let casesString = 'cases=[';
  let deathsString = 'deaths=[';
  let recoveredString = 'recovered=[';
  let datesString = 'dates=[';
  let timeString = 'timeInMs=[';
  if (federalCoronaData.length > 0) {
    cummulatedCasesString += federalCoronaData
      .map((fData) => fData.map((data) => data.cummulatedCases).join(', '))
      .join('; ');
    cummulatedDeathsString += federalCoronaData
      .map((fData) => fData.map((data) => data.cummulatedDeaths).join(', '))
      .join('; ');
    cummulatedRecoveredString += federalCoronaData
      .map((fData) => fData.map((data) => data.cummulatedRecovered).join(', '))
      .join('; ');
    casesString += federalCoronaData
      .map((fData) => fData.map((data) => data.cases).join(', '))
      .join('; ');
    deathsString += federalCoronaData
      .map((fData) => fData.map((data) => data.deaths).join(', '))
      .join('; ');
    recoveredString += federalCoronaData
      .map((fData) => fData.map((data) => data.recovered).join(', '))
      .join('; ');
    datesString += federalCoronaData.map((fData) =>
      fData.map((data) => `'${toDate(data.date)}'`).join('; ')
    );

    timeString += federalCoronaData
      .map((fData) => fData.map((data) => data.date).join(', '))
      .join('; ');

    const octaveString = `${comment}
function [SH,HH,NS,HB,NRW,HS,RLP,BW,BY,SL,BE,BR,MV,S,SA,TH,dates] = bundeslandCoronaData()
  ${cummulatedCasesString}];
  ${cummulatedDeathsString}];
  ${cummulatedRecoveredString}];
  ${casesString}];
  ${deathsString}];
  ${recoveredString}];
  ${datesString}];
  ${timeString}];
  ${federalStateDataString()}
endfunction`;
    return octaveString;
  }
  return '';
}

function federalStateDataString() {
  const federalStates = [
    'SH',
    'HH',
    'NS',
    'HB',
    'NRW',
    'HS',
    'RLP',
    'BW',
    'BY',
    'SL',
    'BE',
    'BR',
    'MV',
    'S',
    'SA',
    'TH',
  ];
  let federalStrateString = '';
  for (let i = 1; i <= federalStates.length; i++) {
    federalStrateString += `${
      federalStates[i - 1]
    }=[timeInMs(${i},:); cases(${i},:); deaths(${i},:); recovered(${i},:); cummulatedCases(${i},:); cummulatedDeaths(${i},:); cummulatedRecovered(${i},:)];\n\t`;
  }
  return federalStrateString;
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function FederalStateDate() {
  const { data } = useStoreState((state) => state.coronaData);
  const federalCoronaData = createFederalCoronaData(data);
  const federalOctaveData = createOctaveString(federalCoronaData);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="comp">
      <div className={classes.root}>
        <div className="comp-center">
          <CopyToClipboard text={federalOctaveData}>
            <Button variant="outlined" color="primary" onClick={handleClick}>
              In Zwischenablage kopieren
            </Button>
          </CopyToClipboard>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Daten in Zwischenbalage kopiert.
            </Alert>
          </Snackbar>
        </div>
      </div>
      <div className="comp-octave">
        <code>{federalOctaveData}</code>
      </div>
    </div>
  );
}
