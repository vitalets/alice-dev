import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { TestButtonClicked } from '../../../store/channels';

const useStyles = makeStyles(theme => ({
  root: {
    // margin: theme.spacing(1),
  },
}));

export default function TestButton() {
  const classes = useStyles();

  return (
      <Button id="test-button" variant="outlined" size="small" onClick={() => TestButtonClicked.dispatch()}>
        ТЕСТ
      </Button>
  );
}
