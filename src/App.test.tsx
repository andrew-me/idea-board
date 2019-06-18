import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('node-uuid', () => {
  return {
    v4: jest.fn(() => Math.random())
  };
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
