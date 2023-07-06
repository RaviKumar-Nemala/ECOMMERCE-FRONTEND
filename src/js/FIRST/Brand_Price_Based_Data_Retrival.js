import { send_request } from "../SEND_REQUESTS/request_sender.js";
import { BASE_URL } from "./Utils.js";

//if price and brand both selected then use this url
let price_brand_url = `${BASE_URL}/brand_category/get_price_brand_based_products`

// if only price selected then use this
let price_url = `${BASE_URL}/brand_category/get_price_based_products`

//only brand selected then use this
let brand_url = `${BASE_URL}/brand_category/get_brand_category_based_products`

let apply_btn = document.querySelector('.Apply_btn_container .Apply_btn')

let brand_container = document.querySelector ( '.brand_container')

let price_container = document.querySelector ( '.price_range_container')

//this url returns the brand names for the given category name
//eg = category name = laptops then brand names = { asus , hp , dell ..etc }
// also returns the min , max prices for the ( useful for price ranged data sorting )
let brand_price_sorting_url = `${BASE_URL}/brand_category/get_brand_price_sorting_options`

const default_price_selection = 'checkbox_0'

async  function send_data ( params , url )
{
     const method_type = 'POST'
     let response =    await send_request ( url ,  params , method_type) 
     let json_response = await response.json()
     return json_response ;
}

export let get_price_brand_based_products =  async ( brands = null , prices =  null , category_name )=>
{
     let params  =
     {
          category_name:category_name
     }
     
     let json_data = null; 

     if ( !brands && !prices )
     {
          return;
     }
     else if ( brands && prices )
     {
          params.brand_names = brands
          params.price_ranges = prices
          json_data = await send_data (params , price_brand_url )
     }
     else if ( brands )
     {
          params.brand_names = brands 
          json_data = await send_data (params , brand_url)
     }
     else 
     {    
          params.price_ranges = prices
          json_data = await send_data( params,  price_url)
     }
     return json_data;
}

export let get_sorting_options = async ( _category_name)=>
{
     const method_type  = 'GET'
     let params  = 
     {
          category_name : _category_name 
     }

     let response = await send_request(brand_price_sorting_url , params , method_type )
     let brand_price_options = await response.json()
     return brand_price_options;
}

export let handle_apply_button = async function __( category_name )
{
     let clicked_brands = new Set()     
     let clicked_prices = new Set()
     let brand_items = brand_container.querySelectorAll('.brand_item')
     let price_items = price_container.querySelectorAll('.price_item')

     brand_items.forEach ( (item) =>
     {
          let input_ele =  item.querySelector('input')

          if ( input_ele.checked)
          {
               let brand_name  = input_ele.nextElementSibling.textContent ;
               brand_name = brand_name.toLowerCase().trim()
               clicked_brands.add( brand_name)
          }
     })

     //if user clicked on any price checkbox then get the data  based on the  brand name with any price range
     price_items.forEach( (price_item)=>
     {
          let price_input = price_item.querySelector('input')
          if ( price_input.checked == true && price_input.id !== default_price_selection)
          {
               let price_range_ele = price_input.nextElementSibling
               let range_val =  price_range_ele.textContent
               let prices  = range_val.split('-')
               prices.forEach( (price) =>
               {
                    //if the price is like (under 20000) need to remove under keywored and extract the number value
                    if ( price.toLowerCase().startsWith('under'))
                    {
                         price =  price.substring(5);
                         clicked_prices.add( 0 );
                         //in the backed we are process based on the min price and max price
                         //under 10,000 means min-price =0 , max-price = 20,000 
                         //this is why we added 0 here to convey the server that we need the  products between  [0 - 10,000 ] range
                    }
                    else if ( price.toLowerCase().startsWith("above"))
                    {
                         price = price.substring( 5 ) ; 
                         clicked_prices.add(500000);
                         //let query = above 20,000 means min-price = 20,000 and max-price = more than 20,000 here we are hard coded the max price to 5lakh
                    }
                    price = price.replace(',','')
                    price   = parseFloat(price.trim()) 
                    clicked_prices.add( price)
               })
          }
     }
     )

     let n1 = clicked_brands.size 
     let n2 = clicked_prices.size 
     let selected_brands = [] 
     let selected_prices = []

     if ( n1 === 0 && n2 === 0 )
     {
          return;
     }
    else  if (n1 != 0  && n2!= 0)
     {
               selected_prices =get_arr(clicked_prices)
               selected_brands = get_arr(clicked_brands)          
     }
     else if ( clicked_brands.size!=0)
     {
          selected_brands = get_arr(clicked_brands)
     }
     else 
     {
          selected_prices = get_arr(clicked_prices)
     } 
     return { selected_brands , selected_prices , category_name }
}

function get_arr( set)
{
     let temp_1 = new Array()

     set.forEach((item)=>
     {
          temp_1.push(item)
     })
     return temp_1
}