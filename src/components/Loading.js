import React from 'react';
import logo from './virusLogo.svg';
import './components.css';

export default function Loading() {
  return (
    <div className="comp-loading">
      <p></p>
      <img src={logo} className="comp-loading-logo" alt="logo" />
      <h1>Loading...</h1>
    </div>
  );
}
