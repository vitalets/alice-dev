import PropTypes from 'prop-types';
import clsx from 'clsx';
import InfoIcon from '@material-ui/icons/Info';
import { green, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { CONNECTION_STATE } from '../store';

const { DISCONNECTED, CONNECTING, CONNECTED} = CONNECTION_STATE;

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
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
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function ConnectionBar() {
  const classes = useStyles();
  const connectionState = useSelector(state => state.connectionState);
  const devices = useSelector(state => state.devices);
  const authCode = useSelector(state => state.authCode);

  let connectionStateText = '';
  let classname;

  switch (connectionState) {
    case CONNECTING:
      connectionStateText = 'Подключение...';
      classname = classes.connecting;
      break;
    case CONNECTED:
      connectionStateText = 'Подключено. ';
      classname = classes.connected;
      break;
    case DISCONNECTED:
    default:
      connectionStateText = 'Нет подключения к серверу.';
      classname = classes.disconnected;
  }

  const message = devices.length
    ? <span>Запустите навык <b>Инструменты разработчика</b> на устройстве: {devices[0].deviceName}</span>
    : <span>Запустите навык <b>Инструменты разработчика</b> и скажите код: <b>{authCode.split('').join(' ')}</b></span>;

  return (
    <div className={clsx(classes.root, classname)}>
      <span id="client-snackbar" className={classes.message}>
        <InfoIcon className={classes.icon}/>
        <span>{connectionStateText}</span>
        &nbsp;
        {message}
      </span>
    </div>
  );
}
