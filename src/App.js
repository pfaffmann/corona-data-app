import React, { useState } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';

import Header from './components/Header';
import Data from './components/Data';
import OctaveData from './components/OctaveData';
import FullDataTable from './components/FullDataTable';
import Footer from './components/Footer';

const views = [
  '',
  'Aktuelle Corona Daten',
  'Corona Daten für Octave',
  'Alle Corona Daten',
];

const viewSchema = {
  activeViewIndex: 0,
};

function App() {
  const [view, setView] = useState(viewSchema);

  return (
    <div className="App">
      <Header viewName={views[view.activeViewIndex]}></Header>
      <div className="App-body">
        <div className="App-buttons">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setView({ activeViewIndex: 1 });
            }}
          >
            Daten anzeigen
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setView({ activeViewIndex: 2 });
            }}
          >
            Octave Daten erzeugen
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setView({ activeViewIndex: 3 });
            }}
          >
            Alle Daten anzeigen
          </Button>
        </div>

        {view.activeViewIndex === 1 ? <Data></Data> : null}
        {view.activeViewIndex === 2 ? <OctaveData></OctaveData> : null}
        {view.activeViewIndex === 3 ? <FullDataTable></FullDataTable> : null}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
