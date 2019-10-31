import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { setFixedResponse } from '../../store';

export default function Text() {
  const text = useSelector(state => state.fixedResponse.text);
  const dispatch = useDispatch();

  return (
    <TextField
      label="TEXT"
      name="text"
      multiline
      rows="3"
      value={text}
      onChange={e => dispatch(setFixedResponse({ text: e.target.value }))}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
