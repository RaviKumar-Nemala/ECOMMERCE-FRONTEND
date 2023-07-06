import {send_request} from '../SEND_REQUESTS/request_sender.js'
import { BASE_URL } from '../FIRST/Utils.js'
const url = `${BASE_URL}/validate_user_info`

export const  send_data_to_server  = async function util( _email)
{
     let user_details = 
     {
          email : _email 
     }
     
   let response =  await  send_request(url ,  user_details ,  'POST');
    console.log( 'PRINTING THE RESPONSE' , response );
    return response;
}