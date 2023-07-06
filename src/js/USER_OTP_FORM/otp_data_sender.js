import { BASE_URL } from '../FIRST/Utils.js'
import { send_request } from '../SEND_REQUESTS/request_sender.js'

const otp_verification_url =  `${BASE_URL}/validate_otp`
const otp_expiration_url =  `${BASE_URL}/check_otp_expiration`
let otp_resend_url =   `${BASE_URL}/resend_otp`

export const  send_otp_to_server =  async  function  util( otp  , user_details)
{
     let total_info =  { otp , ...user_details};

     console.log( total_info ) 
     const method_type = 'POST'
     let response =  await  send_request( otp_verification_url ,total_info, method_type)
 
     console.log ( response )

     return response 

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
     
     console.log ( url )     

     let params =  null 
     
     let method_type =  'PUT'

     //here were using the path variables inorder tosend the username 
     //so params in the send request is going to the null 
     let response =  await send_request(url , params ,  method_type  ) 

    // let response_data =  await response.json() ;

    // console.log ( response )

     return response;
}



