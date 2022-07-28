//React and React Hooks libraries
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
//Material
import { Button, Grid, TextField } from '@mui/material';
//Amplify
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
//Context
import { useUser } from '../context/AuthContext';
import { useRouter } from 'next/router';

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

export default function Signup() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [signUpError, setSignUpError] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  console.log(router);

  /* Destructuring the useForm hook. */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  /**
   * OnSubmit is a function that takes in data, logs it to the console, and then tries to sign up with
   * the email and password. If it fails, it logs the error to the console and sets the signUpError to
   * the error message.
   */
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPassword(data);
        setShowCode(true);
      }
    } catch (error) {
      console.error(error);
      setSignUpError(error.message);
    }
  };

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { username, email, password } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log('Signed up as user:', user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log('Success, singed in as  user', amplifyUser);
      if (amplifyUser) {
        router.push('/');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  }

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
        {/* Email input */}
        <Grid style={{ marginTop: 16 }} item>
          <TextField
            variant="outlined"
            id="email"
            label="Email"
            type="email"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            {...register('email', {
              required: { value: true, message: 'Please enter a valid email.' },
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
        {showCode && (
          <Grid style={{ marginTop: 16 }} item>
            <TextField
              variant="outlined"
              id="code"
              label="Verification code"
              type="text"
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code.message : null}
              {...register('code', {
                required: { value: true, message: 'Please enter a code.' },
                minLength: {
                  value: 6,
                  message: 'Your verification is 6 characters long.',
                },
                maxLength: {
                  value: 6,
                  message: 'Your verification is 6 characters long.',
                },
              })}
            />
          </Grid>
        )}
        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            {showCode ? 'Confirm code' : 'Sign Up'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
