import { Grid, Paper, Typography } from '@mui/material';
import { Comment } from '../API';
import { formatDatePosted } from '../lib/formatDatePosted';
//Icons
import { AccountCircle } from '@mui/icons-material';
//Context
import { useUser } from '../context/AuthContext';
import { useEffect, useState } from 'react';
//Next libs
import Image from 'next/image';
//Amplify
import { Storage } from 'aws-amplify';

interface Props {
  comment: Comment;
}

export default function PostComment({ comment }: Props) {
  const { user } = useUser();
  const [userProfilePictureURL, setUserProfilePictureURL] = useState<
    string | undefined
  >();
  const [userProfilePicture, setUserProfilePicture] = useState<
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

  return (
    <Paper
      style={{
        width: '100%',
        minHeight: 128,
        padding: 16,
        marginTop: 32,
        marginBottom: 30,
      }}
      elevation={1}
    >
      <Grid container spacing={2} direction="column" alignItems="left">
        <Grid item container direction="row" alignItems="center">
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
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            {comment.owner} - {formatDatePosted(comment.createdAt)} hours ago
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">{comment.content}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
