import {makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: -36,
  },
}));

export default function AliceMessageMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const fixResponse = () => {
    closeMenu();
    console.log('fix response');
  };

  return (
    <div className={classes.root}>
      <IconButton className={classes.button} size="small" onClick={showMenu}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={closeMenu}
      >
        <MenuItem onClick={fixResponse}>Зафиксировать</MenuItem>
      </Menu>
    </div>
  );
}
