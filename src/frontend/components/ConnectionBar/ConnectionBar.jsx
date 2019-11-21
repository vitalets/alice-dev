import clsx from 'clsx';
import InfoIcon from '@material-ui/icons/Info';
import { green, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ConnectButton from './ConnectButton';
import ChangeDeviceButton from './ChangeDeviceButton';
import { CONNECTION_STATE } from '../../store';

const { DISCONNECTED, CONNECTING, CONNECTED} = CONNECTION_STATE;

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50
  },
  disconnected: {
    backgroundColor: red[100],
  },
  connecting: {
    backgroundColor: grey[300],
  },
  connected: {
    backgroundColor: green[100],
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing(1),
  },
}));

export default function ConnectionBar() {
  const classes = useStyles();
  const connectionState = useSelector(state => state.connectionState);
  const devices = useSelector(state => state.devices);
  const authCode = useSelector(state => state.authCode);

  let connectionStateText = '';
  let text = '';
  let classname;

  switch (connectionState) {
    case CONNECTING:
      connectionStateText = 'Подключение...';
      classname = classes.connecting;
      break;
    case CONNECTED:
      connectionStateText = 'Подключено.';
      classname = classes.connected;
      text = getText(devices, authCode);
      break;
    case DISCONNECTED:
    default:
      connectionStateText = 'Нет подключения к серверу.';
      classname = classes.disconnected;
  }

  return (
    <div id="connection-bar" className={clsx(classes.root, classname)}>
      <InfoIcon className={classes.icon}/>
      {connectionStateText}&nbsp;{text}
      {connectionState === DISCONNECTED && <ConnectButton/>}
      {connectionState === CONNECTED && devices.length > 0 && <ChangeDeviceButton/>}
    </div>
  );
}

function getText(devices, authCode) {
  if (devices.length > 0) {
    const deviceName = getShortDeviceName(devices[0].deviceName);
    return (
      <span>Скажите что-нибудь в навык <b>Инструменты разработчика</b> на устройстве: {deviceName}</span>
    );
  } else {
    const spacedAuthCode = authCode.split('').join(' ');
    return (
      <span>Запустите навык <b>Инструменты разработчика</b> и скажите код: <b>{spacedAuthCode}</b></span>
    );
  }
}

function getShortDeviceName(deviceName) {
  const matches = deviceName.match(/\((.+?)\)/);
  return matches ? matches[1] : deviceName;
}
