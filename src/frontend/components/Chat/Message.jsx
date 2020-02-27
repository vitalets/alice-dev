import {makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import MessageMenu from './MessageMenu';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    whiteSpace: 'pre-line', // to render new-lines
  },
  alice: {
    borderBottomLeftRadius: 0,
    backgroundColor: theme.palette.grey[200],
  },
  user: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  italic: {
    fontStyle: 'italic'
  },
  error: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText
  }
}));

export default function Message({ type, json }) {
  const classes = useStyles();
  const isUserMessage = type === 'user';
  const isNewSession = isUserMessage && json.session.new;
  const isButtonPressed = isUserMessage && json.request.type === 'ButtonPressed';
  const text = isUserMessage
    ? getUserText(json.request, isNewSession, isButtonPressed)
    : json.response.text;
  const isError = !isUserMessage && /^Error/.test(text);

  const className = clsx(
    'message',
    classes.root,
    isUserMessage ? classes.user : classes.alice,
    isError && classes.error,
    (isNewSession || isButtonPressed) && classes.italic,
  );

  return (
    <Box className={className}>
      {!isError && <MessageMenu type={type} json={json}/>}
      {String(text).trim()}
    </Box>
  );
}

function getUserText(request, isNewSession, isButtonPressed) {
  return isButtonPressed
    ? `ButtonPressed ${JSON.stringify(request.payload)}`
    : (isNewSession ? request.original_utterance : request.command);
}
