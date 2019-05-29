import React from 'react';
import Sticky from './Sticky';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="leftContent">
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
        <p>This is content</p>
      </div>
      <div className="rightContent">
        <p>this is dummy top content</p>
        <p>this is dummy top content</p>
        <p>this is dummy top content</p>
        <Sticky offset={30}>
        <div className="rightContentBox">
          <p>This is first content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is right content</p>
          <p>This is last content</p>
        </div>
        </Sticky>


      </div>
    </div>
  );
}

export default App;
