import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import {mergeFixedResponse} from '../../../store';

export default function Tts() {
  const tts = useSelector(state => state.fixedResponse.tts);
  const dispatch = useDispatch();

  return (
    <TextField
      label="TTS"
      name="tts"
      multiline
      rows="5"
      value={tts}
      onChange={e => dispatch(mergeFixedResponse({ tts: e.target.value }))}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
