import { BASE_URL } from "../../FIRST/Utils.js";
import { send_request} from "../../SEND_REQUESTS/request_sender.js";

async function category_data_helper (  url , params , method_type)
{
     let raw_response  = await send_request(url , params , method_type)
     
     return raw_response;
     
}
export  const retrive_category_products = async  ( category_name_value )=>
{

     console.log('inside of the get_products ')

     const category_based_products_url = `${BASE_URL}/categories/get_products`

     const  method_type = 'GET'

     const params = 
     {
          category_name : category_name_value
     }

    let response =  await category_data_helper( category_based_products_url , params, method_type)

     return response;

//     print_response( json_response )

}

