//Material UI
import { Button, Container, Grid, TextField } from '@mui/material';
//React and React Hooks libraries
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ImageDropzone from '../components/ImageDropzone';
//Other libraries
import { v4 as uuidv4 } from 'uuid';
//Amplify
import { API, Storage } from 'aws-amplify';
//GraphQL
import { createPost } from '../graphql/mutations';
import { CreatePostInput, CreatePostMutation } from '../API';
import { useRouter } from 'next/router';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';

interface IFormInput {
  title: string;
  content: string;
}

interface Props {}

export default function Create({}: Props) {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  /* Destructuring the useForm hook. */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // User uploaded file
    if (file) {
      // Send a request to upload to the S3 Bucket.
      try {
        const imagePath = uuidv4();

        await Storage.put(imagePath, file, {
          contentType: file.type, // contentType is optional
        });

        const createNewPostInput: CreatePostInput = {
          title: data.title,
          content: data.content,
          image: imagePath,
        };

        const createNewPost = (await API.graphql({
          query: createPost,
          variables: { input: createNewPostInput },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        })) as { data: CreatePostMutation };

        console.log('New post created successfully:', createNewPost);

        router.push(`/post/${createNewPost.data.createPost!.id}`);
      } catch (error) {
        console.error('Error uploading file: ', error);
      }
    } else {
      const createNewPostWithoutImageInput: CreatePostInput = {
        title: data.title,
        content: data.content,
      };

      const createNewPostWithoutImage = (await API.graphql({
        query: createPost,
        variables: { input: createNewPostWithoutImageInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: CreatePostMutation };

      router.push(`/post/${createNewPostWithoutImage.data.createPost!.id}`);
    }
  };

  return (
    <div>
      <Container maxWidth="md">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container spacing={2} direction="column">
            {/* Title of the post */}
            <Grid item>
              <TextField
                variant="outlined"
                id="title"
                label="Post title"
                type="text"
                fullWidth
                error={errors.title ? true : false}
                helperText={errors.title ? errors.title.message : null}
                {...register('title', {
                  required: { value: true, message: 'Please enter a title.' },
                  maxLength: {
                    value: 120,
                    message:
                      'Please enter a title that is 120 characters. or less',
                  },
                })}
              />
            </Grid>
            <Grid>
              {/* Content of the post */}
              <TextField
                variant="outlined"
                id="content"
                label="Post Content"
                type="text"
                fullWidth
                multiline
                error={errors.title ? true : false}
                helperText={errors.content ? errors.content.message : null}
                {...register('content', {
                  required: {
                    value: true,
                    message: 'Please enter some content for your post.',
                  },
                  maxLength: {
                    value: 1000,
                    message:
                      'Please make sure your content is 1000 characters or less',
                  },
                })}
              />
            </Grid>
            <ImageDropzone file={file} setFile={setFile} />
            <Button variant="contained" type="submit">
              Create Post
            </Button>
          </Grid>
        </form>
      </Container>
    </div>
  );
}
