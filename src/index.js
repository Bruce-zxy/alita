import React from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import App from './App';

import './index.scss';
import './log';

initReactFastclick();

ReactDOM.render(<App />, document.getElementById('root'));
