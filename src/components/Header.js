import React from 'react';
import '../App.css';

export default function Header(props) {
  let view = props.viewName;

  return (
    <div className="App-header">
      <h1>Corona-Data</h1>
      {view}
    </div>
  );
}
