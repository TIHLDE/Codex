import {
  AuthOptions,
  DefaultSession,
  DefaultUser,
  Session,
  User,
} from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { DefaultJWT, JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getIsInPermittedGroup, getTIHLDEUser, loginToTIHLDE } from './tihlde';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    email: string;
    first_name: string;
    last_name: string;
    tihldeUserToken: string;
  }

  interface JWT extends DefaultJWT {
    email: string;
    first_name: string;
    last_name: string;
    tihldeUserToken: string;
    name: string;
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Brukernavn og passord',
      credentials: {
        username: {
          label: 'Brukernavn',
          type: 'text',
        },
        password: {
          label: 'Passord',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials.password) return null;

        try {
          const tihldeUserToken = await loginToTIHLDE(
            credentials.username,
            credentials.password,
          );

          if (!tihldeUserToken) return null;

          // Check if in allowed group and get user
          const [isPermittedAccess, user] = await Promise.all([
            getIsInPermittedGroup(tihldeUserToken),
            getTIHLDEUser(tihldeUserToken, credentials.username),
          ]);

          if (!isPermittedAccess) return null;

          return { ...user, tihldeUserToken, id: user.user_id };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signIn',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.tihldeUserToken = user.tihldeUserToken;
        token.name = user.first_name + ' ' + user.last_name;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
};

export default authOptions;
