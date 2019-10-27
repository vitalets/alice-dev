import {makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
  root: {
    borderBottomLeftRadius: 0,
    backgroundColor: theme.palette.grey[200],
    position: 'relative',

    maxWidth: '80%',
    borderRadius: 16,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    position: 'absolute',
    top: -30,
  },
  buttonHidden: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility 0s 0.5s, opacity 0.5s ease',
  },
  buttonVisible: {
    visibility: 'visible',
    opacity: 1,
    transition: 'opacity 0.5s ease',
  }
}));

export default function AliceMessage({ text }) {
  const classes = useStyles();
  const [mouseOver, setMouseOver] = React.useState(false);

  const fixResponse = () => {
    console.log('fix response');
  };

  return (
    <Box className={classes.root} onMouseOver={e => setMouseOver(true)} onMouseOut={e => setMouseOver(false)}>
      <IconButton
        onClick={fixResponse}
        className={clsx(classes.button, mouseOver ? classes.buttonVisible : classes.buttonHidden)}
        color="primary"
        size="small"
      >
        <SaveIcon/>
      </IconButton>
      {text}
    </Box>
  );
}
