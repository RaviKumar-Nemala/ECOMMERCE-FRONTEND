import { BASE_URL } from "../FIRST/Utils.js";
import { send_request } from "../SEND_REQUESTS/request_sender.js"
import { retrive_category_products } from "../PRODUCT_FOCUS/CATEGORY_BASED_DATA/category_data_retrival.js";

const electoronics_data_url =  `${BASE_URL}/categories/get_electronics`
const HOME_PAGE_DATA_FETCH = `${BASE_URL}/categories/home_page_data`

const PHONES_CATEGORY = 'phones'
const LAPTOPS_CATEGORY = 'laptops'
const SHOES_CATEGORY = 'shoes'
const WATCHES_CATGORY = 'watches'
const SHIRTS_CATEGORY  = 'shirts' 

export class Front_pg_Model
{        
     async get_home_page_data()
     {         
          let requests = [  retrive_category_products( PHONES_CATEGORY) ,
               retrive_category_products( LAPTOPS_CATEGORY ) , 
               retrive_category_products(WATCHES_CATGORY) ,
               retrive_category_products( SHIRTS_CATEGORY),
               retrive_category_products( SHOES_CATEGORY)];

          let response = await  Promise.all(
                              requests
                         );   
          let resulted_data =  {
               PHONES_CATEGORY : null ,
               LAPTOPS_CATEGORY :null ,
               WATCHES_CATGORY :null ,
               SHIRTS_CATEGORY :null, 
               SHOES_CATEGORY : null
          }

          for( let curr_res of response ){

               if( curr_res.ok){
                    try
                    {
                         let data    = await curr_res.json()          
                         let category_name = data[0].category_name; 
                              if( category_name == PHONES_CATEGORY )
                              {
                                   resulted_data.PHONES_CATEGORY = data;
                              }
                              else if( category_name == LAPTOPS_CATEGORY)
                              {
                                   resulted_data.LAPTOPS_CATEGORY = data;
                                   console.log( resulted_data.LAPTOPS_CATEGORY)
                              }
                              else if (  category_name == SHIRTS_CATEGORY )
                              {
                                    resulted_data.SHIRTS_CATEGORY =  data;
                              }
                              else if (  category_name == WATCHES_CATGORY )
                              {
                                   resulted_data.WATCHES_CATGORY  =  data;
                              }
                              else if( category_name == SHOES_CATEGORY )
                              {
                                    resulted_data.SHOES_CATEGORY = data;
                              }
                    }    
                    catch ( error )
                    {
                          console.log( error ) ; 
                    }
               }
          }
          return   resulted_data;
}
}