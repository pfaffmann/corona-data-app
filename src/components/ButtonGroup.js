import React from 'react';
import Button from '@material-ui/core/Button';
import '../App.css';

export default function ButtonGroup() {
  return (
    <div className="App-buttons">
      <Button variant="outlined" color="primary">
        Daten anzeigen
      </Button>
      <Button variant="outlined" color="primary">
        Octave Daten erzeugen
      </Button>
      <Button variant="outlined" color="primary">
        Alle Daten anzeigen
      </Button>
    </div>
  );
}
