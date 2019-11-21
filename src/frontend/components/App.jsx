import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core';
import ConnectionBar from './ConnectionBar/ConnectionBar';
import Center from './Center';
import Footer from './Footer';
import JSONPopup from './JSONPopup';

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
      <ConnectionBar />
      <Center />
      <Footer />
      <JSONPopup />
    </Container>
  );
}
