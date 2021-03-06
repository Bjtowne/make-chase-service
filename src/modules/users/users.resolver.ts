import {validateJWT} from "../../utils/auth.util";
import {AuthenticationError} from "apollo-server-errors";
import {UserModel} from "../../data-models";

type LoginArgs = {
  jwt: string
};

type LoginResult = {
  success: Boolean;
};

type User = {
  displayName:string
}

export default {
  Mutation: {
    async login(rootValue: any, {jwt}: LoginArgs, context): Promise<LoginResult> {
      let validateJWTResult = await validateJWT(JSON.parse(jwt));
      if (!validateJWTResult.success) {
        return {
          success: false
        }
      }
      context.setCookies.push({
        name: 'session',
        value: validateJWTResult.sessionToken,
        options: {
          httpOnly: true
        }
      })
      return {
        success: true
      };
    },
  },
  Query:{
    async me(rootValue: any, args, context): Promise<string> {
      let session;
      try{
        session = decodeURIComponent(context?.event?.headers?.cookie?.match(/(?<=session=).*?(?=$| |;)/g)[0])
      }finally {
      }
      if(!session){
        throw new AuthenticationError('No Session')
      }
      return session;
    },
    async user(rootValue: any, args, {currentUser}): Promise<User> {
      let user = await UserModel.findOne({_id:currentUser.id})
      console.log('found user',user,{sub:currentUser.sub,iss:currentUser.iss});
      return user;
    }
  }
};
