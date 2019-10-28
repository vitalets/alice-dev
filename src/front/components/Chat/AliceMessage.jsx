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
  }
}));

export default function AliceMessage({ text }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Menu/>
      {text}
    </Box>
  );
}
