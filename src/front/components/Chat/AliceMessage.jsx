import {makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Menu from './AliceMessageMenu';

const useStyles = makeStyles(theme => ({
  root: {
    borderBottomLeftRadius: 0,
    backgroundColor: theme.palette.grey[200],

    maxWidth: '80%',
    borderRadius: 16,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  error: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText
  }
}));

export default function AliceMessage({ responseBody }) {
  const classes = useStyles();
  const text = responseBody.response.text;
  const isError = /error/i.test(text);

  return (
    <Box className={clsx('message', classes.root, isError && classes.error)}>
      <Menu responseBody={responseBody}/>
      {text}
    </Box>
  );
}
