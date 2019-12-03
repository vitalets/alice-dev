import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {useDispatch, useSelector} from 'react-redux';

import Text from './FixedResponse/Text';
import Tts from './FixedResponse/Tts';
import SwitchJson from './FixedResponse/SwitchJson';
import ProxyUrlField from './ProxyUrl/Field';
import ProxyUrlHelp from './ProxyUrl/Help';
import {MODE, setMode, setFixedResponse} from '../../store';

const Editor = React.lazy(() => import(/* webpackChunkName: "FixedResponseEditor" */'./FixedResponse/Editor'));

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    overflowY: 'auto',
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  labelWrapper: {
    display: 'flex',
    marginTop: 8,
    alignItems: 'center'
  },
  radio: {
    flexGrow: 1,
    marginTop: 0,
  },
}));

export default function Form() {
  const classes = useStyles();
  const mode = useSelector(state => state.mode);
  const fixedResponseModeJson = useSelector(state => state.fixedResponseModeJson);
  const fixedResponse = useSelector(state => state.fixedResponse);
  const dispatch = useDispatch();

  return (
    <FormControl component="fieldset" className={classes.root}>
      <RadioGroup value={mode} name="mode" onChange={e => dispatch(setMode(e.target.value))}>
        <div className={classes.labelWrapper}>
          <FormControlLabel
            name="radio-proxy-url"
            value={MODE.PROXY_URL}
            control={<Radio color="primary" />}
            label="Прокси на URL"
            className={classes.radio}
          />
          <ProxyUrlHelp />
        </div>
        <ProxyUrlField/>
        <div className={classes.labelWrapper}>
          <FormControlLabel
            name="radio-fixed-response"
            value={MODE.FIXED_RESPONSE}
            control={<Radio color="primary" />}
            label="Фиксированный ответ"
            className={classes.radio}
          />
          <SwitchJson/>
        </div>
        {fixedResponseModeJson
          ? (
            <React.Suspense fallback={<div>Загрузка...</div>}>
              <Editor json={fixedResponse} onChange={json => dispatch(setFixedResponse(json))}/>
            </React.Suspense>
            )
          : (
            <div>
              <Text/>
              <Tts/>
            </div>
          )
        }
      </RadioGroup>
    </FormControl>
  );
}
