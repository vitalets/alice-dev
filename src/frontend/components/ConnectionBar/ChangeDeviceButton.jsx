import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ChangeDeviceButtonClicked } from '../../store/channels';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function ChangeDeviceButton() {
  const classes = useStyles();

  return (
      <Button
        id="change-device-button"
        className={classes.root}
        variant="outlined"
        size="small"
        onClick={() => ChangeDeviceButtonClicked.dispatch()}
      >
        Сменить
      </Button>
  );
}
