import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {useDispatch, useSelector} from 'react-redux';
import {setFixedResponseModeJson} from '../../../store';

export default function TestButton() {
  const checked = useSelector(state => state.fixedResponseModeJson);
  const dispatch = useDispatch();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          name="fixed-response-mode-json"
          onChange={e => dispatch(setFixedResponseModeJson(e.target.checked))}
          color="primary"
        />
      }
      label="JSON"
    />
  );
}
