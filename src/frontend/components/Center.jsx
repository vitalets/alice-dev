import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Form from './Form/Form';
import Chat from './Chat/Chat';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    marginBottom: 0,
  },
  right: {
    height: '100%',
  },
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
  },
}));

// about scroll-bars: https://material-ui.com/components/grid/#negative-margin
export default function Center() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={6}>
        <Paper className={classes.paper} style={{paddingTop: 0}}>
          <Form />
        </Paper>
      </Grid>
      <Grid item xs={6} className={classes.right}>
        <Paper className={classes.paper} style={{paddingRight: 0}}>
          <Chat />
        </Paper>
      </Grid>
    </Grid>
  );
}
