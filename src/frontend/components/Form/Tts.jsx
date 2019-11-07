import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { setFixedResponse } from '../../store';

export default function Tts() {
  const tts = useSelector(state => state.fixedResponse.tts);
  const dispatch = useDispatch();

  return (
    <TextField
      label="TTS"
      name="tts"
      multiline
      rows="4"
      value={tts}
      onChange={e => dispatch(setFixedResponse({ tts: e.target.value.trim() }))}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
