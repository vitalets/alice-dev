import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { setFixedResponse } from '../../store';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 4,
  },
}));

export default function Text() {
  const classes = useStyles();
  const text = useSelector(state => state.fixedResponse.text);
  const dispatch = useDispatch();

  return (
    <TextField
      className={classes.root}
      label="TEXT"
      name="text"
      multiline
      rows="5"
      value={text}
      onChange={e => dispatch(setFixedResponse({ text: e.target.value }))}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
