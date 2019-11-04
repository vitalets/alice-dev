import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AliceMessage from './AliceMessage';
import UserMessage from './UserMessage';
import NewSession from './NewSession';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

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
  const chatMessages = useSelector(state => state.chatMessages);

  return (
    <Box className={clsx('chat', classes.root)}>
      {chatMessages.map(message => {
        const {id, requestBody, responseBody, error} = message;

        const newSession = requestBody.session.new
          ? <NewSession key={'new-session-' + id}/>
          : null;

        const userMessage = requestBody.request.command
          ? <UserMessage key={'user-message-' + id} text={requestBody.request.command}/>
          : null;

        const aliceMessage = responseBody
          ? <AliceMessage key={'alice-message-' + id} text={responseBody.response.text} error={error}/>
          : null;

        return ([
          newSession,
          userMessage,
          aliceMessage
        ]);
      })}
    </Box>
  );
};
