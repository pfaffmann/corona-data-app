import React, { useState } from 'react';
import './components.css';

import Loading from './Loading';

export default function Data() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="comp">{loading ? <Loading /> : <h1>Octave Data</h1>}</div>
  );
}
