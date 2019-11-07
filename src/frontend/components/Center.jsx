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
  gridCell: {
    height: '100%',
  },
  paper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    // padding: theme.spacing(1),
    paddingRight: 0, // for scroll
  },
}));

// about scroll-bars: https://material-ui.com/components/grid/#negative-margin
export default function Center() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={6} className={classes.gridCell}>
        <Paper className={classes.paper} style={{paddingTop: 0}}>
          <Form />
        </Paper>
      </Grid>
      <Grid item xs={6} className={classes.gridCell}>
        <Paper className={classes.paper}>
          <Chat />
        </Paper>
      </Grid>
    </Grid>
  );
}
