import { BASE_URL, get_jwt } from "../FIRST/Utils.js"
import { send_request  } from "../SEND_REQUESTS/request_sender.js"
import { get_uuid_val } from "../FIRST/Utils.js"
export  class Orders_Model 
{
     #ORDER_DETAILS_URL = `${BASE_URL}/orders/get_order_items`
     #ORD_METHOD_TYPE  = 'POST'
     #ORDER_CANCEL_URL = `${BASE_URL}/orders/cancel_order_items`
     #ORD_CACEL_METHOD_TYPE ='POST'
     #ORD_RETURN_FETCH_URL = `${BASE_URL}/orders/get_canceled_items`;
     #ORD_RETURNS_METHOD_TYPE='POST'
     async fetch_order_details ( _jwt_token )
     {
          let params = {
               jwt_token :  _jwt_token
          }
          // alert( this.#ORDER_DETAILS_URL)
          
          let response = await  send_request(this.#ORDER_DETAILS_URL , params, this.#ORD_METHOD_TYPE,  _jwt_token)

          if( response.ok)
          {
               return  await response.json();
          }
     }
     async get_cancel_orders ( _jwt_token)
     {    
          let params =  { 
               jwt_token  : _jwt_token
          }

          let response  = await send_request ( this.#ORD_RETURN_FETCH_URL , params , this.#ORD_METHOD_TYPE, _jwt_token)
          
          console.log( response ) ; 
          
     }
     async cancel_order( _order_date , _order_time ,_product_uuid)
     {
          // alert('called')
          let _jwt_token = get_jwt();

          if ( _jwt_token == null )
          {
               alert('login to your page ')
               return;
          }
          _product_uuid = get_uuid_val( _product_uuid ) 
          let params = 
          {
               jwt_token :  _jwt_token , 
               order_date : _order_date , 
               order_time : _order_time ,
               product_uuid : _product_uuid
          }

          let response =  await send_request(this.#ORDER_CANCEL_URL , params , this.#ORD_CACEL_METHOD_TYPE , _jwt_token);

          if( response.ok )
          {
               let data =  await response.json();
               console.log( data ) ;
               return data;
          }
          else 
          {
               console.log ( response.text)
          }
     }

}