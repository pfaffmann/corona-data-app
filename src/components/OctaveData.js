import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStoreState } from 'easy-peasy';
import './components.css';

import {
  generateOctaveData,
  toDate,
  sortArrayByMeldedatum,
} from '../functions';

import Loading from './Loading';

function createOctaveString(coronaData) {
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
## Created: ${toDate(today)}\n`;

  if (coronaData.length > 0) {
    const cummulatedCasesString = coronaData
      .map((data) => data.cummulatedCases)
      .join(', ');
    const cummulatedDeathsString = coronaData
      .map((data) => data.cummulatedDeaths)
      .join(', ');
    const cummulatedRecoveredString = coronaData
      .map((data) => data.cummulatedRecovered)
      .join(', ');
    const octaveString = `${comment}function y = coronaData()\n  cases=[${cummulatedCasesString}];\n  deads=[${cummulatedDeathsString}];\n  recovered=[${cummulatedRecoveredString}];\n  y=[cases;deads;recovered];\nendfunction`;
    return octaveString;
  }
  return '';
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

export default function CoronaData() {
  const [loading, setLoading] = useState(false);
  const [coronaData, setCoronaData] = useState([]);
  const [coronaOctaveData, setCoronaOctaveData] = useState([]);
  const [open, setOpen] = useState(false);
  const { data } = useStoreState((state) => state.coronaData);

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

  useEffect(() => {
    setLoading(true);
    setCoronaData(sortArrayByMeldedatum(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (coronaData.length > 0) {
      setCoronaOctaveData(generateOctaveData(coronaData));
      setLoading(false);
    }
  }, [coronaData]);

  return (
    <div className="comp">
      {loading ? (
        <Loading />
      ) : (
        <div>
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
              ## under the terms of the GNU General Public License as published
              by
            </code>
            <code className="octave-comments">
              ## the Free Software Foundation, either version 3 of the License,
              or
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
              ## You should have received a copy of the GNU General Public
              License
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
            <code className="octave-comments">
              ## Created: {toDate(new Date())}
            </code>
            <code>
              <span className="octave-function">function</span> <span>y</span>{' '}
              <span className="octave-symbols">=</span> <span>coronaData</span>{' '}
              <span className="octave-symbols">()</span>
            </code>

            <code className="comp-octave-tab">
              <span>cases </span>
              <span className="octave-symbols">= [</span>
              {coronaOctaveData.map((data) => (
                <span>
                  <span className="octave-numbers">{data.cummulatedCases}</span>
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
                  <span className="octave-numbers">
                    {data.cummulatedDeaths}
                  </span>
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
              <span>cases</span>
              <span className="octave-symbols">;</span>
              <span>deads</span>
              <span className="octave-symbols">;</span>
              <span>recovered</span>
              <span className="octave-symbols">];</span>
            </code>
            <code className="octave-function">endfunction</code>
          </div>
          <div className={classes.root}>
            <div className="comp-center">
              <CopyToClipboard text={createOctaveString(coronaOctaveData)}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClick}
                >
                  In Zwischenablage kopieren
                </Button>
              </CopyToClipboard>
              <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="success">
                  Daten in Zwischenbalage kopiert.
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
