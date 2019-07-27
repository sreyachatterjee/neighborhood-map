import React, { Component } from 'react';
import './App.css';

class Errorscreen extends Component {
  state = {
    errMsg: 'Google Maps Error: Problem loading Google Maps API'
  }

  render() {
    return (
      <h1 className='errorscreen-msg'>{this.state.errMsg}</h1>
    )
  }
}

export default Errorscreen;
