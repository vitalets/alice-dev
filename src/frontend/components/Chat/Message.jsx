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
  error: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText
  }
}));

export default function Message({ type, json }) {
  const classes = useStyles();
  const isUserMessage = type === 'user';
  const text = isUserMessage ? json.request.command : json.response.text;
  const isError = !isUserMessage && /^Error/.test(text);

  const className = clsx(
    'message',
    classes.root,
    isUserMessage ? classes.user : classes.alice,
    isError && classes.error
  );

  return (
    <Box className={className}>
      {!isError && <MessageMenu type={type} json={json}/>}
      {text}
    </Box>
  );
}
