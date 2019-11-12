import {makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import { MODE, setMode, setFixedResponse } from '../../store';
import { ShowJSONPopup } from '../../store/channels';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: -39,
  },
  buttonRight: {
    right: 0
  }
}));

export default function MessageMenu({ type, json }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const fixResponse = () => {
    closeMenu();
    dispatch(setMode(MODE.FIXED_RESPONSE));
    dispatch(setFixedResponse(json.response));
  };

  const showJsonBox = () => {
    closeMenu();
    ShowJSONPopup.dispatch({ type, json });
  };

  return (
    <div className={classes.root}>
      <IconButton className={clsx(classes.button, type === 'user' && classes.buttonRight)} size="small" onClick={showMenu}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
      >
        {type === 'alice' && <MenuItem onClick={fixResponse}>Зафиксировать ответ</MenuItem>}
        <MenuItem onClick={showJsonBox}>JSON</MenuItem>
      </Menu>
    </div>
  );
}
