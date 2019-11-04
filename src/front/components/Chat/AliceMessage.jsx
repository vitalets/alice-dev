import {makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
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

export default function AliceMessage({ text }) {
  const classes = useStyles();
  const isError = /error/i.test(text);

  return (
    <Box className={clsx('message', classes.root, isError && classes.error)}>
      <Menu/>
      {text}
    </Box>
  );
}
