import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Errorscreen from './Errorscreen';

window.googlemap_authFailure = () => {
    ReactDOM.render(<Errorscreen/>, document.getElementById('root'));
}
  
ReactDOM.render(<App/>, document.getElementById('root'));
serviceWorker.register();
