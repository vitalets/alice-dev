import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { setProxyUrl } from '../../store';

const useStyles = makeStyles(theme => ({
  textField: {
    // marginTop: 0,
  },
}));

export default function ProxyUrl() {
  const classes = useStyles();
  const url = useSelector(state => state.proxyUrl);
  const dispatch = useDispatch();

  return (
    <TextField
      label="URL"
      placeholder="http://localhost:3000"
      value={url}
      onChange={e => dispatch(setProxyUrl(e.target.value))}
      className={classes.textField}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
