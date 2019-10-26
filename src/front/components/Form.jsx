import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FixedAnswer from './FixedAnswer';
import ProxyUrl from './ProxyUrl';


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
  const [value, setValue] = React.useState('fixed-answer');

  const handleChange = event => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  return (
    <FormControl component="fieldset" className={classes.root}>
      <RadioGroup value={value} onChange={handleChange}>
        <FormControlLabel
          value="proxy"
          control={<Radio color="primary" />}
          label="Прокси на URL"
          className={classes.radio}
        />
        <ProxyUrl disabled={value !== 'proxy'}/>
        <FormControlLabel
          value="fixed-answer"
          control={<Radio color="primary" />}
          label="Фиксированный ответ"
          className={classes.radio}
        />
        <FixedAnswer disabled={value !== 'fixed-answer'}/>
      </RadioGroup>
    </FormControl>
  );
}
