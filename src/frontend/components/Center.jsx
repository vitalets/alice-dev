import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Form from './Form/Form';
import Chat from './Chat/Chat';
import ValidationCheckbox from './Form/ValidationCheckbox';
import TestButton from './TestButton';

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
    flexDirection: 'column',
    // padding: theme.spacing(2),
    paddingRight: 0, // for scroll
  },
  header: {
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    borderBottom: 'solid 1px #D7DBDD'
  },
  headerLabel: {
    flexGrow: 1
  }
}));

// about scroll-bars: https://material-ui.com/components/grid/#negative-margin
export default function Center() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={6} className={classes.gridCell}>
        <Paper className={classes.paper} style={{paddingTop: 0}}>
          <h3 className={classes.header}>
            <span className={classes.headerLabel}>Ответ навыка</span>
            <ValidationCheckbox />
          </h3>
          <Form />
        </Paper>
      </Grid>
      <Grid item xs={6} className={classes.gridCell}>
        <Paper className={classes.paper}>
          <h3 className={classes.header}>
            <span className={classes.headerLabel}>Лог</span>
            <TestButton />
          </h3>
          <Chat />
        </Paper>
      </Grid>
    </Grid>
  );
}
