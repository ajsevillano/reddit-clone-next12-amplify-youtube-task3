//React and React Hooks libraries
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
//Material
import { Button, Grid, TextField } from '@mui/material';
//Amplify
import { Auth } from 'aws-amplify';

//Context
import { useRouter } from 'next/router';

interface IFormInput {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  /* Destructuring the useForm hook. */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const amplifyUser = await Auth.signIn(data.username, data.password);
    if (amplifyUser) {
      router.push('/');
    } else {
      throw new Error('Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        {/* User name input*/}
        <Grid style={{ marginTop: 16 }} item>
          <TextField
            variant="outlined"
            id="username"
            label="Username"
            type="text"
            error={errors.username ? true : false}
            helperText={errors.username ? errors.username.message : null}
            {...register('username', {
              required: { value: true, message: 'Please enter a username.' },
              minLength: {
                value: 3,
                message: 'Please enter a username between 3-16 characters.',
              },
              maxLength: {
                value: 16,
                message: 'Please enter a username between 3-16 characters.',
              },
            })}
          />
        </Grid>

        {/* Password input */}
        <Grid style={{ marginTop: 16 }} item>
          <TextField
            variant="outlined"
            id="password"
            label="Password"
            type="password"
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : null}
            {...register('password', {
              required: { value: true, message: 'Please enter a password.' },
              minLength: {
                value: 8,
                message: 'Please enter a stronger password.',
              },
            })}
          />
        </Grid>

        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            Sign In
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
