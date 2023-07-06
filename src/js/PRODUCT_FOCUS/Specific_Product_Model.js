import { send_request } from "../SEND_REQUESTS/request_sender.js";
import { BASE_URL, to_json, has_jwt, CART_SUCCESSFUL_INSERTION  } from "../FIRST/Utils.js";
import { Carts_Model } from "../CARTS/Carts_Model.js";
import { Carts_Model } from "../CARTS/Carts_Model.js";

const  UUID_BASED_DATA_RETRIVAL_QUERY = `${BASE_URL}/products/get_product`
const category_based_products_url = `${BASE_URL}/categories/get_products`
const CARTS_STORAGE_URL = `${BASE_URL}/add_to_cart`
const IMG_FETCH_URL = `${BASE_URL}/products/get_image/`

export class Specific_Product_Model
{
     #category_name = null
     #product_uuid = null
     #price = null
     #curr_product_brand_name= null
     #similar_brand_items = null;
     #product_name = null; 
     //excluding the current brand mainly used to send the data to the product down section 
     #similar_category_items = null 
     #set_similar_brand_items ( items   )
     {    
          if ( items != null)
               return
          this.#similar_brand_items = items ;
     }
     #set_similar_category_items ( items )
     {
          if ( items != null) 
               return;
          this.#similar_category_items =  items ;
     }

     get_similar_brand_items ( )
     {
          return this.#similar_brand_items
     }
     
     get_similar_category_items () 
     {
          return this.#similar_category_items ; 
     }

     #set_price (price_val)
     {    
          if( this.#price == null )
          this.#price   = price_val
     }
     #set_category_name (category_name) 
     {
          if ( this.#category_name != null)
               return;
          else 
               this.#category_name = category_name
     }

     get_price ()
     {
          return this.#price
     }
     //setting the uuid value ( all the url path like local host :2022 will be removed here)
     #set_product_uuid (uuid_value) 
     {
          if ( this.#product_uuid  == null ){
           [this.#product_uuid] = uuid_value.split("/").slice(-1);
          }          
     }  

     get_product_uuid (  )
     {
          return this.#product_uuid
     }

     get_category_name () 
     {
          return this.#category_name
     }

     #set_brand_name (brand_name) 
     {
          if ( this.#curr_product_brand_name != null)    
               return; 
          else 
               this.#curr_product_brand_name =  brand_name 
     }

     get_brand_name ( )
     {
          return this.#curr_product_brand_name;
     }

     #set_product_name ( product_name) 
     {
          this.#product_name  =  product_name ;
          return; 
     }
     get_product_name() 
     {
          return this.#product_name ;
     }

     #set_curr_product_data (data) 
     {
          console.log ( data )
          let { product_name ,  product_uuid , price , category_name , brand_name} =  data
          console.log ( product_uuid , price , category_name , brand_name)

          this.#set_brand_name(brand_name )
          this.#set_price(price)
          this.#set_product_uuid(product_uuid)
          this.#set_category_name ( category_name)
          this.#set_product_name ( product_name )          
     }

     //takes the data sorts the data based on the similar brand on one array
     //and similar category based products in another array
     sort_by_brand_category( data ) 
     {
          let brand_name =  this.get_brand_name () 

          console.log( brand_name )

          let brand_based_items = new Array () 
          let category_based_items = new Array()
          console.log ( data )

          for ( let item of data)
          {
              if ( item.brand_name == brand_name )
              {
                    brand_based_items.push( item)
              }
              else 
              {
                    category_based_items.push ( item)
              }
          }

          console.log( brand_based_items )
          console.log ( category_based_items  )
          this.#similar_brand_items =  brand_based_items
          this.#similar_category_items = category_based_items
     }

     async get_data_by_uuid ( uuid )
     {
          const method_type =  'GET'    
          let params = { uuid }
          let response = await  send_request ( UUID_BASED_DATA_RETRIVAL_QUERY ,  params , method_type)
          let json_response  =await to_json( response )
          this.#set_curr_product_data ( json_response )
          return  json_response;
     }

     async get_data_by_category( _category_name )
     {
          const  method_type = 'GET'
          const params = 
          {
               category_name : _category_name
          }
          
          let response =  await send_request ( category_based_products_url ,  params , method_type)
          let data = await to_json( response )
          this.sort_by_brand_category( data ) 
          return data;
     }

     async #store_cart_to_db ({ product_uuid , total ,  jwt_token , quantity = 1 })
     {
          let params = 
          {
               jwt_token : jwt_token,
               product_uuid : product_uuid,
               total :  total,
               quantity : quantity
          }
          const method_type = 'POST'
          let response = await  send_request( CARTS_STORAGE_URL ,  params ,  method_type , jwt_token)
          return new Promise((resolve, reject) =>
          {
               if( response.ok)
               {
                    resolve(CART_SUCCESSFUL_INSERTION)
               }
               else if( response.status == 403)
               {
                    reject(SESSION_EXPIRED_MSG);
               }
               else 
               {    
                    response.text().then( (msg)=>
                    {
                         reject( msg ) ;
                    }
                    )
               }
          })

     }

     async store_cart_item  (  _product_uuid  , _total )
     {
     const _jwt_token = has_jwt( );
     if ( _jwt_token )
     {
          let response_msg  = await this.#store_cart_to_db({product_uuid : _product_uuid , total : _total , jwt_token : _jwt_token})
          return response_msg ;
     }
    else {
          // alert ( 'jwt_token is not found ' )

          let product_name = this.get_product_name ( ) ;
          let price   = this.get_price() ;
          let product_uuid = IMG_FETCH_URL + this.get_product_uuid();
          let category_name = this.get_category_name() 

          let data =  { 
               quantity :  1 , 
               products_details :  {
                    product_name : product_name ,
                    price : price , 
                    product_uuid : product_uuid , 
                    category_name  : category_name 
               }
          }

          console.log( data ) 

          let  carts_model  = new carts_model();
          this.store_carts_to_local(data)         

          return new Promise( (resolve, reject)=>
          {
               resolve( CART_SUCCESSFUL_INSERTION )
          }
          )
     }
}
}