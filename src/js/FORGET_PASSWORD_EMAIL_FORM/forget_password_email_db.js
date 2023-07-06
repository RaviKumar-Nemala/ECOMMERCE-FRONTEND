import { send_request } from "../SEND_REQUESTS/request_sender.js";
import { BASE_URL } from "../FIRST/Utils.js";

let  forget_password_url=   `${BASE_URL}/forget_password`

export let send_data = async function  send_data (  _username )
{
     let method_type  = 'GET'
     let params = 
     {
          username : _username
     }
     let response  = await send_request(forget_password_url,  params , method_type )
     return response 
}
