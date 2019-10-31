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

  let text = '';
  let classname;

  switch (connectionState) {
    case CONNECTING:
      text = 'Подключение...';
      classname = classes.connecting;
      break;
    case CONNECTED:
      text = 'Подключено.';
      classname = classes.connected;
      break;
    case DISCONNECTED:
    default:
      text = 'Нет подключения к серверу.';
      classname = classes.disconnected;
  }

  return (
    <div className={clsx(classes.root, classname)}>
      <span id="client-snackbar" className={classes.message}>
        <InfoIcon className={classes.icon}/>
        {text}
      </span>
    </div>
  );
}
