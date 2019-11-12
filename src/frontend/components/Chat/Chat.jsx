import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Message from './Message';
import NewSession from './NewSession';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    scrollBehavior: 'smooth',
    // https://stackoverflow.com/questions/36130760/use-justify-content-flex-end-and-to-have-vertical-scrollbar
    '& > :first-child': {
      marginTop: 'auto !important',
    }
  },
}));

export default function Chat() {
  const classes = useStyles();
  const chatMessages = useSelector(state => state.chatMessages);

  const chatEl = useRef(null);
  useEffect(() => {
    chatEl.current.scrollTop = chatEl.current.scrollHeight;
  });

  return (
    <Box ref={chatEl} className={clsx('chat', classes.root)}>
      {chatMessages.map(message => {
        const {id, requestBody, responseBody} = message;

        const newSession = requestBody.session.new
          ? <NewSession key={'new-session-' + id}/>
          : null;

        const userMessage = requestBody
          ? <Message key={'user-message-' + id} type="user" json={requestBody}/>
          : null;

        const aliceMessage = responseBody
          ? <Message key={'alice-message-' + id} type="alice" json={responseBody}/>
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
