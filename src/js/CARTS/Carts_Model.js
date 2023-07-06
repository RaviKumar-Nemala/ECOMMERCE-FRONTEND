import { send_request } from "../SEND_REQUESTS/request_sender.js"
import { has_jwt, to_json ,BASE_URL } from "../FIRST/Utils.js"

const CART_ITEM_REMOVAL_URL = `${BASE_URL}/remove_cart_item`
const ADD_TO_CART_URL = `${BASE_URL}/add_to_cart`
const CARTS_DATA_RETRIVAL_URL = `${BASE_URL}/get_carts_data`
const QUANTITY_UPDATER_URL = `${BASE_URL}/update_quantity`
const CART_DETAILS = "cart_details"
export class Carts_Model
{
     //if the user is not logged in then store his cart details in the localstorage       
     #get_data_by_storage () 
      {
               let result =  localStorage.getItem(CART_DETAILS  );
     
               if ( result != null )
                    result = JSON.parse( result );
               return result;
     }
     //used to store the cart detials in the localstorage 
     //useful for handling the temparory user cart details 
     store_carts_to_local( data) 
     {
          let carts_data = this.#get_data_by_storage();
          if ( !carts_data  )
          {
               localStorage.setItem(CART_DETAILS, "[]")
          }
          carts_data = Array.from( carts_data) 
          let duplicate =  false  ; 
          let n = carts_data.length ; 
          let{ products_details:{product_uuid}} = data ;
          let new_prd_uuid = product_uuid ; 

          if ( n != 0 )
          {    
               for(let idx = 0 ; idx  <  n ; idx ++)
               {
                    let cart_obj =  carts_data[ idx ] ;
                    let { products_details: { product_uuid }} = cart_obj ;
                    if( product_uuid == new_prd_uuid )
                    {
                         duplicate = true ;
                         break;
                    }
               }
          } 

          if( duplicate == false ) 
          {
                carts_data.push (  data ) ; 
          }
          
          localStorage.setItem(CART_DETAILS ,  JSON.stringify(carts_data))
     }

     async update_quantity ( _quantity_val , _product_uuid )
     {
          let _jwt_token = has_jwt( ) ;

          if ( !_jwt_token )
          {
                return;
          }   
          
          let method_type  = 'PUT';

          let params  = { 
               jwt_token :  _jwt_token , 
               quantity_val : _quantity_val , 
               product_uuid : _product_uuid  
          };

          let response   = await send_request ( QUANTITY_UPDATER_URL ,  params , method_type , _jwt_token ) ;  

          console.log ( response )  ; 

     }
     async get_cart_items () 
     {

         const _jwt_token = has_jwt();

         //if the jwt token is not present then retrive the cart details from the localstorage and display it 
         if ( !_jwt_token )
         {
               return this.#get_data_by_storage() ;
         }

          let params  = 
          {
               jwt_token  : _jwt_token
          }
          const method_type = 'GET'
     
          let response = await send_request ( CARTS_DATA_RETRIVAL_URL , params ,   method_type ,  _jwt_token )

          if ( !response.ok)
          {
               let body = await response.text()

               console.log( body)
               
          }

          else if( response.status == 403)   
          {
               
          }
          else if ( response.ok ){
          let json_response  = await to_json(response )

          console.log( json_response )

          return json_response;
          }
     }

     async remove_cart( _product_uuid)
     {
          console.log( _product_uuid ) 

          const _jwt_token =  has_jwt( ) 

          if ( _jwt_token == null ) 
               return 

          let params = {      
               jwt_token : _jwt_token,
               product_uuid :_product_uuid 
          }

          const method_type = 'DELETE'
          let response = await send_request(CART_ITEM_REMOVAL_URL , params , method_type , _jwt_token)
          console.log (  response  )
          
     }


}