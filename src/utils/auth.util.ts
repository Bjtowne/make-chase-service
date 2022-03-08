import {OAuth2Client} from "google-auth-library";
import {appConf} from "../appConf";
import {encrypt} from "./crypto.util";

const client = new OAuth2Client(appConf.google.clientId);

type ValidateJWTResult = {
  success:boolean,
  sessionToken?:string,
  payload?:any
}

export async function validateJWT(jwt:any):Promise<ValidateJWTResult>{
  try{
    if(jwt.clientId !== appConf.google.clientId){
      console.error(`Invalid ClientID! ${jwt.clientId}`)
      return {success:false};
    }
    const ticket = await client.verifyIdToken({
      idToken: jwt.credential,
      audience: jwt.clientId
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    let sessionDetails = {
      sub:payload.sub,
      iss:payload.iss,
      created:Date.now()
    }
    let sessionToken = encrypt(JSON.stringify(sessionDetails));
    return {
      success:true,
      sessionToken,
      payload
    };
  }catch (e){
    console.error(e);
    return {success:false};
  }

}