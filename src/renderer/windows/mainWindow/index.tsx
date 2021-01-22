import * as React from 'react';
import {ipcRenderer} from 'electron';
import {render} from 'react-dom';
import './styles.scss';
import '../window.scss';
import Frame from '../../components/Frame';

const MainWindow: React.FC = () => {
  const createWindow = () => {
    ipcRenderer.send('create-new-window');
  }

  return (
    <div className={'window'}>
      <Frame title={'Window creator'}/>
      <main>
        <h1>Window creator</h1>

        <button onClick={createWindow}>Create new window</button>
      </main>
    </div>
  );
};

const domContainer = document.querySelector('#root');
render(<MainWindow/>, domContainer);
