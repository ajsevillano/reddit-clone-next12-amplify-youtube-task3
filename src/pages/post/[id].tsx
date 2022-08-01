//React, React Hooks & Next libraries
import { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useForm, SubmitHandler } from 'react-hook-form';
//Amplify
import { API, withSSRContext } from 'aws-amplify';
//GraphQL
import { createComment } from '../../graphql/mutations';
import { getPost, listPosts } from '../../graphql/queries';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
//API Calls
import {
  CreateCommentInput,
  CreateCommentMutation,
  GetPostQuery,
  ListPostsQuery,
  Post,
  Comment,
} from '../../API';
//Material
import { Button, Container, Grid, TextField } from '@mui/material';
//Components
import PostPreview from '../../components/PostPreview';
import PostComment from '../../components/PostComment';

//Interfaces
interface IFormInput {
  comment: string;
}
type Props = {
  post: Post;
};

export default function IndividualPost({ post }: Props) {
  const [comments, setComments] = useState<Comment[]>(
    post.comments!.items as Comment[]
  );
  //Destructuring the useForm hook.
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  //OnSubmit takes in data, creates a new comment, and then adds that comment to the comments array.
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newCommentInput: CreateCommentInput = {
      postID: post.id,
      content: data.comment,
    };
    //Add comment mutation
    const createNewComment = (await API.graphql({
      query: createComment,
      variables: { input: newCommentInput },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    })) as { data: CreateCommentMutation };

    setComments([...comments, createNewComment.data.createComment as Comment]);
  };

  return (
    <Container maxWidth="md">
      <PostPreview post={post} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        style={{ marginTop: 32, marginBottom: 32 }}
      >
        <Grid container spacing={2} direction="row" alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <TextField
              variant="outlined"
              id="comment"
              label="Add a comment"
              type="text"
              multiline
              fullWidth
              error={errors.comment ? true : false}
              helperText={errors.comment ? errors.comment.message : null}
              {...register('comment', {
                required: { value: true, message: 'Please enter a comment.' },
                minLength: {
                  value: 3,
                  message: 'Please enter a comment between 3-16 characters.',
                },
                maxLength: {
                  value: 240,
                  message: 'Please enter a comment b under 240 characters.',
                },
              })}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" type="submit">
              Add comment
            </Button>
          </Grid>
        </Grid>
      </form>
      {comments
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((comment) => (
          <PostComment key={comment.id} comment={comment} />
        ))}
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // A function that returns an object with the API property. */
  const SSR = withSSRContext();

  const postsQuery = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params?.id,
    },
  })) as { data: GetPostQuery };

  // By returning { props: { posts } }, the Individual Post component will receive `post` as a prop at build time
  return {
    props: {
      post: postsQuery.data.getPost as Post,
    },
    // Next.js will attempt to re-generate the page  when a request comes in once every 1 second
    revalidate: 1, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();
  const response = (await SSR.API.graphql({ query: listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  const paths = response.data.listPosts!.items!.map((post) => ({
    params: { id: post!.id },
  }));

  return { paths, fallback: 'blocking' };
};
