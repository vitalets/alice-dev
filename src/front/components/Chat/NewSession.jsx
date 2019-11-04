import {makeStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
}));

export default function NewSession() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography
        color="textSecondary"
        display="block"
        variant="caption"
      >
        Новая сессия
      </Typography>
      <Divider/>
    </div>
  );
}
