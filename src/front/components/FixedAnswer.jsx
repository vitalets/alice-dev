import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  textField: {
    // flexGrow: 1,
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
  },
}));

export default function FixedAnswer(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    text: 'Привет!',
    tts: 'Прив+ет!',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return [
      <TextField
        key="text"
        label="TEXT"
        multiline
        rows="4"
        value={values.text}
        onChange={handleChange('text')}
        className={classes.textField}
        margin="normal"
        variant="outlined"
        fullWidth
        disabled={props.disabled}
      />,
      <TextField
        key="tts"
        label="TTS"
        multiline
        rows="4"
        value={values.tts}
        onChange={handleChange('tts')}
        className={classes.textField}
        margin="normal"
        variant="outlined"
        fullWidth
        disabled={props.disabled}
      />,
  ];
}
