import { send_request } from "../SEND_REQUESTS/request_sender.js"
import { BASE_URL } from "../FIRST/Utils.js"

const url = `${BASE_URL}/forget_password/update_password`

export  let send_data = async function util ( username  , password )
{

let params={
     user_name  : username ,
     old_password:password,
     new_password:password
}
const method_type =  'POST'
let response   = await send_request( url , params ,  method_type )
return response ;

}