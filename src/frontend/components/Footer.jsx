import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1)
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <Typography variant="body2" color="textSecondary">
        {'Copyright © Виталий Потапов '}
        {new Date().getFullYear()}
        <Link style={{float: 'right'}} color="inherit" href="https://github.com/vitalets/alice-dev/issues" target="_blank">
          Предложить идею или сообщить об ошибке
        </Link>
      </Typography>
    </footer>
  );
}
