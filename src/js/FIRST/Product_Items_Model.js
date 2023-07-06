`use strict`
import { send_request } from "../SEND_REQUESTS/request_sender.js";
import { process_response, BASE_URL}  from './Utils.js'
import { handle_apply_button } from "./Brand_Price_Based_Data_Retrival.js";
import { get_price_brand_based_products } from "./Brand_Price_Based_Data_Retrival.js";

const category_based_products_url = `${BASE_URL}/categories/get_products`

class Product
{

     #product_name ; 
     #price ; 
     #product_side_images ;
     #product_specifications ;
     #product_uuid ;
     #category_name;

     constructor ( product_name , price , product_side_images , product_specifications,product_uuid , category_name)
     {
          this.#product_name = product_name;
          this.#price = price 
          this.#product_side_images = product_side_images
          this.#product_specifications =  product_specifications 
          this.#product_uuid = product_uuid;
          this.#category_name = category_name;
     }

     get_product_details () 
     {
          return { 
              product_name : this.#product_name,
              price : this.#price,
              product_side_images:this.#product_side_images ,
              product_specifications :this.#product_specifications,
              product_uuid :this.#product_uuid,
              category_name :this.#category_name
          }
     }
     get_category_name ()
     {
          return this.#category_name;
     }

     get_product_price()
     {
          return this.#price;
     }
     get_product_specification ()
     {
          return this.#product_specifications;
     }
     get_product_uuid ()
     {
          return this.#product_uuid;
     }

}

export class Product_Items_Model 
{
     
     #category_name ;

     set_category_name (category_name)
     {
          this.#category_name = category_name
     }
     get_category_name ()
     {
          return this.#category_name
     }
     static bind_to_product_obj ( json_response )
     {
          let products_list = [];

          for ( let idx = 0 ; idx < json_response.length; idx ++)
          {
               const product_name = json_response[i].product_name;
               const price = json_response[i].price ;
               const product_uuid = json_response[i].product_uuid;
               const product_side_images = json_response[i].product_side_images
               const category_name = json_response[i].category_name ;
               const product_specifications =  json_response[i].prdoduct_specificatons;

               const product_item = new Product(product_name ,  price ,product_specifications, product_uuid ,  product_side_images , category_name )

               products_list.push( product_item)
          }

          console.log ( products_list)

          return products_list;
     }
     
     static async  get_category_based_data( _category_name ) 
     {

          const  method_type = 'GET'
     
          const params = 
          {
               category_name : _category_name
          }

          let response = await send_request( category_based_products_url ,  params , method_type , null)
          
          let { data } = await process_response( response )

          if ( data == null )
               return ;
          
         return  bind_to_product_obj()
     }

     async get_clicked_brand_price_names ()
     {
          //alert( this.get_category_name() )

          return ( await handle_apply_button( this.get_category_name()))
     }
     async get_price_brand_based_products( brands ,  prices , category_name )
     {
          let response = await  get_price_brand_based_products(brands, prices ,category_name)
          return response
     }
}