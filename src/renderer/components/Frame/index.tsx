import * as React from 'React';
import './styles.scss';
import {ipcRenderer} from 'electron';

interface Props {
  title: string,
}

const Frame: React.FC<Props> = ({title}) => {
  document.title = title;

  const minimize = () => {
    ipcRenderer.send('minimize');
  };

  const maximize = () => {
    ipcRenderer.send('maximize');
  };

  const close = () => {
    ipcRenderer.send('close');
  };

  return (
    <div className={'frame-wrapper'}>
      <h4 className={'frame-title'}>{title}</h4>
      <div className={'frame-actions'}>
        <button onClick={minimize}  className={'frame-action minimize-action'}>🗕</button>
        <button onClick={maximize} className={'frame-action maximize-action'}>🗖</button>
        <button onClick={close} className={'frame-action close-action'}>✕</button>
      </div>
    </div>
  );
}

export default Frame;
