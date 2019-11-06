import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
  },
  homeIcon: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function TopBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <BuildIcon className={classes.homeIcon}/>
          <Typography variant="h6" className={classes.title}>
            Панель разработки навыков Алисы
          </Typography>
          <Typography variant="subtitle1">
            Запустите навык "Инструменты разработчика"
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
