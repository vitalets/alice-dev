import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TopBar from './TopBar';
import StatusBar from './StatusBar';

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <TopBar />
        <StatusBar />
      </Container>
    </React.Fragment>
  );
}
