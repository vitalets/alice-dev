import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Form from './Form';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 0,
  },
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    paddingTop: 0,
    display: 'flex',
  },
}));

// about scroll-bars: https://material-ui.com/components/grid/#negative-margin
export default function Center() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Form />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          fghdfgsdgffh
        </Paper>
      </Grid>
    </Grid>
  );
}
