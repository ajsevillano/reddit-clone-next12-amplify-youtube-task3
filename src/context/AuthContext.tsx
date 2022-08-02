import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CognitoUser } from '@aws-amplify/auth';
import { Auth, Hub } from 'aws-amplify';

//Interfaces
interface UserContextType {
  user: CognitoUser | null;
  setUser: Dispatch<SetStateAction<CognitoUser | null>>;
  userInfo: UserData | undefined;
}
interface Props {
  children: React.ReactElement;
}

interface UserData {
  id: string;
  attributes: {
    email: string;
    email_verified: string;
    picture: string;
    sub: string;
  };
  username: string;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export default function AuthContext({ children }: Props) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [userInfo, setUserInfo] = useState<UserData>();

  useEffect(() => {
    checkUser();
    getUserInfo();
  }, []);

  useEffect(() => {
    /* Listening to the `auth` event. */
    Hub.listen('auth', () => {
      checkUser();
    });
  }, []);

  async function checkUser() {
    try {
      const amplifyUser = await Auth.currentAuthenticatedUser();
      if (amplifyUser) {
        setUser(amplifyUser);
      }
    } catch (error) {
      //No current signed in user.
      setUser(null);
    }
  }

  async function getUserInfo() {
    try {
      const amplifyUser = await Auth.currentUserInfo();
      if (amplifyUser) {
        setUserInfo(amplifyUser);
      }
    } catch (error) {
      //No current signed in user.
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, userInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextType => useContext(UserContext);
