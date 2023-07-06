import { BASE_URL } from "../FIRST/Utils.js"
import { send_request } from "../SEND_REQUESTS/request_sender.js"

export  class Product_Returns_Model 
{
     #PRODUCT_RETURNS_URL = `${BASE_URL}/orders/get_canceled_items`
     #RETURNS_METHOD_TYPE = 'POST' 
      
     async fetch_cancel_ord_details ( _jwt_token ) 
     {
          let params = {
               jwt_token : _jwt_token
          }
          let response =  await  send_request ( this.#PRODUCT_RETURNS_URL , params ,  this.#RETURNS_METHOD_TYPE , _jwt_token) ; 
          let json_data =  null; 
          if( response.ok)
          {
               json_data =   await response.json () ;
               console.log ( json_data ) ; 
          }
          return json_data; 
     }
}