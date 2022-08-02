//Material UI Icons components
import {
  Alert,
  Box,
  ButtonBase,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  CreateVoteInput,
  CreateVoteMutation,
  Post,
  UpdateVoteInput,
  UpdateVoteMutation,
} from '../API';
//Material UI Icons
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
//Next libs
import Image from 'next/image';
import { useRouter } from 'next/router';
//Other libs
import { useState, useEffect } from 'react';
import { formatDatePosted } from '../lib/formatDatePosted';
import { createVote, updateVote } from '../graphql/mutations';
//Amplify
import { API, Storage } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
//Context
import { useUser } from '../context/AuthContext';

interface Props {
  post: Post;
}

export default function PostPreview({ post }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>();
  const [existingVote, setExistingVote] = useState<string | undefined>(
    undefined
  );
  const [existingVoteId, setExistingVoteId] = useState<string | undefined>(
    undefined
  );
  const [upvotes, setUpvotes] = useState<number>(
    post.votes!.items
      ? post.votes!.items.filter((v) => v!.vote === 'upvote').length
      : 0
  );

  const [downvotes, setDownvotes] = useState<number>(
    post.votes!.items
      ? post.votes!.items.filter((v) => v!.vote === 'downvote').length
      : 0
  );

  useEffect(() => {
    if (user) {
      const tryFindVote = post.votes!.items?.find(
        (v) => v!.owner === user.getUsername()
      );

      if (tryFindVote) {
        setExistingVote(tryFindVote.vote);
        setExistingVoteId(tryFindVote.id);
      }
    }
  }, [user, post.votes]);

  useEffect(() => {
    async function getImageFromStorage() {
      try {
        const signedURL = await Storage.get(post.image!); // get key from Storage.list
        setPostImage(signedURL);
      } catch (error) {
        console.log('No image found.');
      }
    }

    getImageFromStorage();
  });

  const addVote = async (voteType: string) => {
    if (existingVote && existingVote != voteType) {
      const updateVoteInput: UpdateVoteInput = {
        id: existingVoteId!,
        vote: voteType,
        postID: post.id,
      };

      const updateThisVote = (await API.graphql({
        query: updateVote,
        variables: { input: updateVoteInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: UpdateVoteMutation };
      // if they're changing their vote...
      // updateVote rather than create vote.

      if (voteType === 'upvote') {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      }

      if (voteType === 'downvote') {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(updateThisVote.data.updateVote!.id);
    }

    if (!existingVote) {
      const createNewVoteInput: CreateVoteInput = {
        vote: voteType,
        postID: post.id,
      };

      const createNewVote = (await API.graphql({
        query: createVote,
        variables: { input: createNewVoteInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: CreateVoteMutation };

      if (createNewVote.data.createVote!.vote === 'downvote') {
        setDownvotes(downvotes + 1);
      }
      if (createNewVote.data.createVote!.vote === 'upvote') {
        setUpvotes(upvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(createNewVote.data.createVote!.id);
    }

    if (existingVote === voteType) {
      setOpen(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const checkUserLogin = (vote: string) => {
    if (!user) {
      setOpen(true);
    } else {
      addVote(vote);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        marginBottom: 30,
        borderTop: '5px  solid',
        borderImage: 'linear-gradient(to left, #f5af19, #e42a2a)',
        borderImageSlice: 1,
        borderWidth: '5px',
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={3}
        style={{ padding: 12, marginTop: 4 }}
      >
        {/* Upvote / votes / downvote */}
        <Grid item style={{ maxWidth: 128 }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                onClick={() => checkUserLogin('upvote')}
              >
                {upvotes ? <ArrowUpward color="success" /> : <ArrowUpward />}
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" direction="column">
                <Grid item>
                  <Typography variant="h6">{upvotes - downvotes}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">votes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                onClick={() => checkUserLogin('downvote')}
              >
                {downvotes ? (
                  <ArrowDownward color="error" />
                ) : (
                  <ArrowDownward />
                )}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        {/* Content Preview */}
        <Grid item>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Typography variant="body1">
                  Posted by
                  <Box component="span" style={{ color: '#f5af19' }} m={1}>
                    {post.owner}
                  </Box>
                  {formatDatePosted(post.createdAt)} hours ago
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3">{post.title}</Typography>
              </Grid>
              <Grid
                item
                style={{
                  maxHeight: 32,
                  overflowY: 'hidden',
                  overflowX: 'hidden',
                }}
              >
                <Typography variant="body1">{}</Typography>
                <Typography variant="body1">{post.content}</Typography>
              </Grid>
              {post.image && postImage && (
                <Grid item>
                  <Image
                    alt={post.title}
                    src={postImage}
                    height={540}
                    width={980}
                    layout="intrinsic"
                  />
                </Grid>
              )}
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Only one vote per post is allow.
        </Alert>
      </Snackbar>
    </Paper>
  );
}
