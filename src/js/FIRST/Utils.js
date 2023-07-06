`use strict`
import { send_request } from "../SEND_REQUESTS/request_sender.js"
const JWT_TOKEN_KEY = "jwt_token"

// export const BASE_URL = 'http://localhost:2022'
export const BASE_URL = 'http://13.51.204.67:2022'

const brand_category_names_url =  `${BASE_URL}/input/get_brands_categories`

export const UNAUTHORIZED = 'UNAUTHORIZED ACCESS'

export const  CART_SUCCESSFUL_INSERTION = 'ITEM INSERTED INTO CARTS';

export const SESSION_EXPIRED_MSG = "SESSION EXPIRED PLEASE LOGIN AGAIN";

export const ERROR_MSG = "SOMETHING WENT WRONG PLEASE TRY AFTER SOMETIME";

export const remove_jwt = ()=> localStorage.removeItem("jwt_token");

export function has_jwt()
{
     return localStorage.getItem(JWT_TOKEN_KEY)
}

export function divert_page ( page_url ,  uuid ,  category_name )
{
     console.log( page_url)

     uuid = uuid.trim().split("/").slice(-1)
     
     console.log( uuid )

     let param = { uuid  , category_name }

     page_url = page_url + '?' + (new URLSearchParams(param)).toString()
     
     console.log( page_url)

     window.open(page_url)

}

export function reload_page( page_url , obj)
{
    page_url = page_url + "?"+( new URLSearchParams(obj).toString())
     console.log( page_url)

     window.location.assign ( page_url)
}

export function transfer_page(  page_url )
{
     window.location.assign(page_url);
}

export let to_json = async function to_json( response ) 
{
     return await response.json();
}
export async function get_auto_suggestions_data () 
{
     const method_type ='GET'

     const url = brand_category_names_url ; 

     let response  = await send_request(url , null ,method_type)
     if ( response.ok)
     {
          let json_response = await response.json () 
         
          console.log ( json_response)
          
          return json_response 
     }
     else
     {
          alert('something went wrong while get auto suggestions data')
          return null;
     }
}

export let  process_response = async (response)=>
{
     if ( response.ok)
     {
          return { data : await response.json() }
     }
     else 
     {
          console.log( response.status)
          return { data  : null};
     }
}


export  function get_currency_options () 
{
     let currency_options = 
{
     style:  "currency",
     currency  : "INR",
     minimumFractionDigits : 0 ,
     maximumFractionDigits:2
}
return currency_options;
}

export function get_uuid_val ( product_uuid )
{
     return product_uuid.split("/").at(-1);

}
export function get_jwt()
{
     if ( has_jwt() )
     {
          return localStorage.getItem("jwt_token")
     }
     else 
          return null;
}