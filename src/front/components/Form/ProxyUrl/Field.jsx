import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { setProxyUrl } from '../../../store';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 2,
  },
}));

export default function Field() {
  const classes = useStyles();
  const url = useSelector(state => state.proxyUrl);
  const dispatch = useDispatch();

  return (
    <TextField
      className={classes.root}
      label="URL"
      name="proxy-url"
      placeholder="http://localhost:3000"
      value={url}
      onChange={e => dispatch(setProxyUrl(e.target.value))}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
