import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  textField: {
    // marginTop: 0,
  },
}));

export default function ProxyUrl(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('http://localhost:3000');

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <TextField
      label="URL"
      placeholder="http://localhost:3000"
      value={value}
      onChange={handleChange}
      className={classes.textField}
      margin="normal"
      variant="outlined"
      fullWidth
      disabled={props.disabled}
    />
  );
}
