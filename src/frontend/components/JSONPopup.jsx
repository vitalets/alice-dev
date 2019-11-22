import {makeStyles} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { ShowJSONPopup } from '../store/channels';
const JSONViewer = React.lazy(() => import(/* webpackChunkName: "JSONViewer" */'./JSONViewer'));

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function JSONPopup() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [json, setJson] = React.useState({});
  const [type, setType] = React.useState('user');

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    ShowJSONPopup.addListener(({type, json}) => {
      setOpen(true);
      setType(type);
      setJson(json);
    });
  });

  return (
      <Dialog
        id="json-popup"
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth={true}
        maxWidth="sm"

      >
        <DialogTitle>
          {type === 'user' ? 'JSON запроса' : 'JSON ответа'}
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <React.Suspense fallback={<div>Загрузка...</div>}>
            <JSONViewer json={json}/>
          </React.Suspense>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
  );
}

