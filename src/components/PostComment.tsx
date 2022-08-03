import { Grid, Paper, Typography } from '@mui/material';
import { Comment } from '../API';
import { formatDatePosted } from '../lib/formatDatePosted';
//Icons
import { AccountCircle } from '@mui/icons-material';
//Next libs
import Image from 'next/image';
//UseProfile Hook
import useProfilePicture from '../lib/useProfilePicture';

interface Props {
  comment: Comment;
}

export default function PostComment({ comment }: Props) {
  const { ProfilePicture } = useProfilePicture();

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
          {ProfilePicture ? (
            <div
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                width: '25px',
                height: '25px',
              }}
            >
              <Image
                src={ProfilePicture}
                alt={ProfilePicture}
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
