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
  userInfo: Attributes | undefined;
}
interface Props {
  children: React.ReactElement;
}

interface Attributes {
  email: string;
  email_verified: string;
  picture: string;
  sub: string;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export default function AuthContext({ children }: Props) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [userInfo, setUserInfo] = useState<Attributes>();

  useEffect(() => {
    checkUser();
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
        setUserInfo(amplifyUser.attributes);
      }
    } catch (error) {
      //No current signed in user.
      setUser(null);
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, userInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextType => useContext(UserContext);
