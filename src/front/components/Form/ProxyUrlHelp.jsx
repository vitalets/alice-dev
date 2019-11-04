import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function ProxyUrlHelp() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton variant="contained" onClick={handleClick}>
        <HelpIcon/>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>
          Чтобы работало проксирование запросов на URL,<br/>
          ваш навык должен отдавать HTTP заголовок:<br/>
          <code>Access-Control-Allow-Origin: *</code>
          <br/><br/>
          Пример для <b>Node.js:</b><br/>
          <code>res.setHeader('Access-Control-Allow-Origin', '*');</code>
          <br/><br/>
          Пример для <b>Python:</b><br/>
          <code>self.send_header("Access-Control-Allow-Origin", "*")</code>
          <br/><br/>
          Пример для <b>PHP:</b><br/>
          <code>header("Access-Control-Allow-Origin: *");</code>
          <br/><br/>
          На взаимодействие с серверами Алисы это не влияет.<br/>
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank">Подробнее про CORS</a>.
        </Typography>
      </Popover>
    </div>
  );
}
