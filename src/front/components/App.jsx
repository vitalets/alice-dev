import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TopBar from './TopBar';
import ConnectionBar from './ConnectionBar';
import Center from './Center';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <CssBaseline />
      <TopBar />
      <ConnectionBar />
      <Center />
    </Container>
  );
}
