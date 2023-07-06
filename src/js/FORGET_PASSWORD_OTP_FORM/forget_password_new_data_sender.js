import { BASE_URL } from '../FIRST/Utils.js'
import { send_request } from '../SEND_REQUESTS/request_sender.js'

const otp_verification_url = `${BASE_URL}/forget_password/validate_otp`
const otp_expiration_url =  `${BASE_URL}/check_otp_expiration`
let otp_resend_url =   `${BASE_URL}/forget_password/resend_otp`;

export const  send_otp_to_server =  async  function  util( otp  , username)
{
    let otp_details =
    {
     user_name : username,
     otp : otp
    }

    let response =  await  send_request( otp_verification_url , otp_details , 'POST');
    return response;
}

export const  check_for_expiration = async ( user_name )=>
{
     const method_type =  'POST'
     // alert(user_name)
     let response =  await send_request( otp_expiration_url , {email:user_name} , method_type);
     let msg  = await response.text();
     if ( response.ok )
     {
          return new Promise((resolve, reject)=>
          {
               resolve( msg);
          })
     }
     else 
     {
          return new Promise((resolve, reject)=>
          {
               reject(msg)
          })
     }
}

export let  send_resend_notification  = async function otp_resend( username){
     let url =  otp_resend_url + `/${username}`     
     let params =  null 
     let method_type =  'PUT'
     //here were using the path variables inorder tosend the username 
     //so params in the send request is going to the null 
     let response =  await send_request(url , params ,  method_type  ) 

     return response;
}