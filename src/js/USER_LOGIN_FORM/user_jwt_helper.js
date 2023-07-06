import { BASE_URL } from "../FIRST/Utils.js"
import { send_request } from "../SEND_REQUESTS/request_sender.js"

const url =   `${BASE_URL}/jwt`

export  const  get_jwt    = async (  _username , _password ) =>{

     let user_details =  { 
               username : _username ,
               password  : _password   
     }
     const method_type = 'POST'

     let respose =  await send_request ( url ,  user_details , method_type )
     
     return respose;
}




