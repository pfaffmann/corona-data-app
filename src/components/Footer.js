import React from 'react';
import '../App.css';

export default function Footer() {
  return (
    <div className="App-footer">
      <div>
        <span role="img" alt="copyright" aria-label="copyright">
          ©️&nbsp;
        </span>
        Christoph Pfaffmann
      </div>
      <div>
        Daten bereitgestellt von{' '}
        <a
          href="https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RKI COVID19
        </a>{' '}
        <a
          href="https://www.arcgis.com/home/item.html?id=f10774f1c63e40168479a1feb6c7ca74"
          target="_blank"
          rel="noopener noreferrer"
        >
          Beschreibung
        </a>
      </div>
      <div>2020</div>
    </div>
  );
}
