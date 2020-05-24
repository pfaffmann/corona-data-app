import React, { useState } from 'react';
import './components.css';

import Loading from './Loading';

export default function Data() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="comp">{loading ? <Loading></Loading> : <h1>Data</h1>}</div>
  );
}
