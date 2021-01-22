import * as React from 'react';
import {render} from 'react-dom';
import useWindowsConnection from '../../hooks/useWindowsConnection';
import './styles.scss';
import '../window.scss';
import Frame from '../../components/Frame';

const SecondWindow: React.FC = () => {
  const {toggleWindowsConnection, touchingWindows, connectedWindows} = useWindowsConnection();

  return (
    <div className={'window'}>
      <Frame title={'Second window'}/>
      <main className={touchingWindows.reduce((acc, i) => acc + i.side + ' ', '')}>
        <h1>Second window</h1>
        {touchingWindows.map(i => (
          <button key={i.id} onClick={() => toggleWindowsConnection(i)}>
            {connectedWindows.includes(i.id) ? `Disconnect window from ${i.id}` : `Connect window to ${i.id}`}
          </button>
        ))}
      </main>
    </div>
  );
};

const domContainer = document.querySelector('#root');
render(<SecondWindow/>, domContainer);
