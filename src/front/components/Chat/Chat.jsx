import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AliceMessage from './AliceMessage';
import UserMessage from './UserMessage';

const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // https://stackoverflow.com/questions/36130760/use-justify-content-flex-end-and-to-have-vertical-scrollbar
    '& > :first-child': {
      marginTop: 'auto !important',
    }
  },
}));

export default function Chat() {
  const classes = useStyles();
  const [messages] = React.useState([
    {request: {command: '1привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {response: {text: '2привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {request: {command: '3привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {response: {text: '4привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {request: {command: '5привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {response: {text: '6привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {request: {command: '7привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
    {response: {text: '8привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет привет '}},
  ]);

  return (
    <Box className={classes.root}>
      {messages.map((message, index) => {
        return message.request
          ? <UserMessage key={index} text={message.request.command}/>
          : <AliceMessage key={index} text={message.response.text}/>;
      })}
    </Box>
  );
};
