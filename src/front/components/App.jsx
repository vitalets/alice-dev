import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import Center from './Center';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.root}>
      <CssBaseline />
      <TopBar />
      <StatusBar />
      <Center />
    </Container>
  );
}
