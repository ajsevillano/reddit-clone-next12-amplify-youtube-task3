//React libs
import { useEffect, useState } from 'react';
//Amplify
import { Storage } from 'aws-amplify';
//Context
import { useUser } from '../context/AuthContext';

const useProfilePicture = () => {
  const { user } = useUser();
  const [ProfilePictureURL, setProfilePictureURL] = useState<
    string | undefined
  >();
  const [ProfilePicture, setProfilePicture] = useState<string | undefined>();

  // Getting the user attribute "image" from the user object.
  useEffect(() => {
    user?.getUserAttributes((err, result) => {
      setProfilePictureURL(result![3].Value);
    });
  }, [user]);

  // Getting the image from the storage and setting it to the state.
  useEffect(() => {
    async function getImageFromStorage() {
      try {
        const signedURL = await Storage.get(ProfilePictureURL!); // get key from Storage.list
        setProfilePicture(signedURL);
      } catch (error) {
        console.log('No image found.');
      }
    }

    if (ProfilePictureURL) {
      getImageFromStorage();
    }
  });

  return { ProfilePicture };
};

export default useProfilePicture;
