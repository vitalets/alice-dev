import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ConnectButtonClicked } from '../store/channels';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
  },
}));

export default function ConnectButton() {
  const classes = useStyles();

  return (
      <Button
        id="connect-button"
        className={classes.root}
        variant="outlined"
        size="small"
        onClick={() => ConnectButtonClicked.dispatch()}
      >
        Соединиться
      </Button>
  );
}
