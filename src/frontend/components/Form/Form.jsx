import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {useDispatch, useSelector} from 'react-redux';

import Text from './Text';
import Tts from './Tts';
import ProxyUrlField from './ProxyUrl/Field';
import TestButton from './ProxyUrl/TestButton';
import ProxyUrlHelp from './ProxyUrl/Help';
import {MODE, setMode} from '../../store';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
  },
  radio: {
    marginTop: theme.spacing(1),
  },
}));

export default function Form() {
  const classes = useStyles();
  const mode = useSelector(state => state.mode);
  const dispatch = useDispatch();

  return (
    <FormControl component="fieldset" className={classes.root}>
      <RadioGroup value={mode} name="mode" onChange={e => dispatch(setMode(e.target.value))}>
        <div style={{display: 'flex', marginTop: 8, alignItems: 'center'}}>
          <FormControlLabel
            style={{flexGrow: 1, marginTop: 0}}
            name="radio-proxy-url"
            value={MODE.PROXY_URL}
            control={<Radio color="primary" />}
            label="Прокси на URL"
            className={classes.radio}
          />
          <TestButton />
          <ProxyUrlHelp />
        </div>
        <ProxyUrlField/>
        <FormControlLabel
          name="radio-fixed-response"
          value={MODE.FIXED_RESPONSE}
          control={<Radio color="primary" />}
          label="Фиксированный ответ"
          className={classes.radio}
        />
        <Text/>
        <Tts/>
      </RadioGroup>
    </FormControl>
  );
}