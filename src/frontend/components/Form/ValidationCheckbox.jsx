import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {useDispatch, useSelector} from 'react-redux';
import {setValidateResponse} from '../../store';

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: theme.typography.body2.fontSize,
  },
  input: {
    padding: 3,
  },
}));

export default function ValidationCheckbox() {
  const classes = useStyles();
  const checked = useSelector(state => state.validateResponse);
  const dispatch = useDispatch();

  return (
    <FormControlLabel
      classes={{
        label: classes.label
      }}
      control={
        <Checkbox
          id="validation-checkbox"
          className={classes.input}
          checked={checked}
          onChange={e => dispatch(setValidateResponse(e.target.checked))}
          color="primary"
        />
      }
      label="валидировать"
    />
  );
}
