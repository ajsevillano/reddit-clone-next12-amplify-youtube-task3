//Next & React Libs
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
//Icons
import { Add, Reddit, AccountCircle } from '@mui/icons-material';
//Amplify
import { Auth } from 'aws-amplify';
import { Storage } from 'aws-amplify';
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
  Box,
} from '@mui/material';

export default function Header() {
  const router = useRouter();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [userProfilePicture, setUserProfilePicture] = useState<
    string | undefined
  >();
  const [userProfilePictureURL, setUserProfilePictureURL] = useState<
    string | undefined
  >();

  // Getting the user attribute "image" from the user object.
  useEffect(() => {
    user?.getUserAttributes((err, result) => {
      setUserProfilePictureURL(result![3].Value);
    });
  }, [user]);

  // Getting the image from the storage and setting it to the state.
  useEffect(() => {
    async function getImageFromStorage() {
      try {
        const signedURL = await Storage.get(userProfilePictureURL!); // get key from Storage.list
        setUserProfilePicture(signedURL);
      } catch (error) {
        console.log('No image found.');
      }
    }

    if (userProfilePictureURL) {
      getImageFromStorage();
    }
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUserOut = async () => {
    setAnchorEl(null);
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
                {userProfilePicture ? (
                  <div
                    style={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      width: '25px',
                      height: '25px',
                    }}
                  >
                    <Image
                      src={userProfilePicture}
                      alt={userProfilePicture}
                      objectFit="cover"
                      width="25px"
                      height="25px"
                    />
                  </div>
                ) : (
                  <AccountCircle />
                )}

                <Box component="span" sx={{ ml: 1.5, fontSize: '1rem' }}>
                  {user?.getUsername()}
                </Box>
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
