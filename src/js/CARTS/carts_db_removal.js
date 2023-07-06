//used to remove the carts data from the databse
//sends the request to the backend server
//based on the jwt token

import { send_request } from '../SEND_REQUESTS/request_sender.js'
import { BASE_URL } from '../FIRST/Utils.js';

function get_jwt ()
{
     let jwt = localStorage.getItem("jwt_token");
     return jwt;
}

export function  cart_removal_db (  _jwt_token ,  _product_uuid )
{
     const url = `${BASE_URL}/remove_cart_item`
     
     let params = 
     {
          jwt_token : _jwt_token , 
          product_uuid : _product_uuid
     }

     const method_type = 'DELETE'

     let response = send_request(url,params,method_type,_jwt_token)

     response.then((value)=> 
     {
          console.log( value )
     }
     )
}