import {makeStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  root: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,

    maxWidth: '80%',
    borderRadius: 16,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function UserMessage({ text }) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {text}
    </Box>
  );
}
