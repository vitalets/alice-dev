import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import ProxyUrl from './ProxyUrl';
import Text from './Text';
import Tts from './Tts';

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
  const [mode, setMode] = React.useState('fixed-response');
  //const [mode, setMode] = useGlobalState('mode');

  const handleChange = event => {
    const newValue = event.target.value;
    setMode(newValue);
    // onModeChanged.dispatch({isFixedResponse: newValue === 'fixed-response'});
  };

  return (
    <FormControl component="fieldset" className={classes.root}>
      <RadioGroup value={mode} onChange={e => setMode(e.target.value)}>
        <FormControlLabel
          value="proxy"
          control={<Radio color="primary" />}
          label="Прокси на URL"
          className={classes.radio}
        />
        <ProxyUrl/>
        <FormControlLabel
          value="fixed-response"
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
