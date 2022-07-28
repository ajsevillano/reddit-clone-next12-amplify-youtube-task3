//Next & React Libs
import { useRouter } from 'next/router';
import React from 'react';
//Icons
import { Add, Reddit, AccountCircle } from '@mui/icons-material';
//Amplify
import { Auth } from 'aws-amplify';
//Context
import { useUser } from '../context/AuthContext';
//Material UI
import {
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

export default function Header() {
  const router = useRouter();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUserOut = async () => {
    await Auth.signOut();
  };

  return (
    <div style={{ flexGrow: 1, marginBottom: 32 }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            edge="start"
            style={{}}
            color="inherit"
            aria-label="menu"
            onClick={() => router.push(`/`)}
          >
            <Reddit />
          </IconButton>
          <Typography
            variant="h6"
            style={{ flexGrow: 1 }}
            onClick={() => router.push(`/`)}
          >
            Reddit Clone
          </Typography>
          {user && (
            <div>
              <Tooltip title="Create Post">
                <IconButton
                  onClick={() => router.push(`/create`)}
                  aria-label="create"
                  color="inherit"
                >
                  <Add />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => signUserOut()}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
          {!user && (
            <>
              <Button variant="outlined" onClick={() => router.push(`/login`)}>
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(`/signup`)}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
