import { get_auto_suggestions_data, reload_page  , divert_page, BASE_URL} from "./Utils.js"
import { store_brand_category_names } from "../HEADER_SECTION/input_based_search.js"
import { get_sorting_options } from "./Brand_Price_Based_Data_Retrival.js";
import { Product_Items_View } from "./Product_Items_View.js";
import { Product_Items_Model } from "./Product_Items_Model.js";
import { send_data  } from "../HEADER_SECTION/input_based_search.js";
import { login_status_init} from "../HEADER_SECTION/header.js"

async function handle_auto_suggestions() {
     const json_response = await get_auto_suggestions_data()
     store_brand_category_names(json_response);
}

let product_items_view = new Product_Items_View()
let product_items_model = new Product_Items_Model()

const SPECIFIC_PRODUCT_PAGE = '../PRODUCT_FOCUS/product_focus.html'
const CURRENT_PAGE  = './products_list.html'

//url for fetching the data based on the product_uuid
const PRODUCT_DATA_URL =  `${BASE_URL}/products/get_product/`

class Product_Items_Controller {

     #get_clicked_product_info ( product_item )
     {
          let product_div = product_item.querySelector('.product_div')          
          let product_img = product_div.querySelector('.product_div  img')
          let product_uuid = product_img.getAttribute("src")
          let product_name = product_div.querySelector('.product_name').textContent
          let price = product_div.querySelector('.product_price').textContent

          return { product_name : product_name , product_uuid  : product_uuid , price : price }
     }

     #handle_clicked_product( product_item)
     {
          let { product_name , product_uuid , price } = this.#get_clicked_product_info(product_item)
          let category_name = product_items_model.get_category_name() 
          divert_page( SPECIFIC_PRODUCT_PAGE  ,  product_uuid ,category_name )
     }

     //obtain the clicked product info
     //based on the image uuid of the clicked product start getting the data from the backend
     handle_lazy_loading( )
     {
          let img_list = document.querySelectorAll('.product_img')
          let temp = true
          let observer = new IntersectionObserver(
               function (list )
               {
                    list.forEach(  (curr_ele) => {
                         console.log( curr_ele)
                    if( !curr_ele.isIntersecting )return;

                    let target_img = curr_ele.target
                    target_img.src = target_img.dataset.src ;

                    target_img.onload = ( ) =>
                    {
                         target_img.classList.remove('blurr_img')
                         observer.unobserve(target_img)
                    }
                    } )
               }, {rootMargin :  '100px'},
          )

          img_list.forEach( (img) =>
          {
               observer.observe( img)
          })
     }

     add_listeners() {
          let product_items = document.getElementsByClassName('product_item')
          product_item_controller.handle_lazy_loading()

          for (let product_item of product_items) {
               if (product_item != null) {
                    product_item.addEventListener('click', (e) => {
                    
                    let pi  = new Product_Items_Controller()

                    pi.#handle_clicked_product(product_item)
                    })
               }
          }
     }
     #set_products( total_products )
     {
          this.total_products = total_products 
     }

     async render( data = null) {
          handle_auto_suggestions()
          let products_data = null

          if ( data == null)
               return;
          else 
          {
               products_data = data
          }

          let category_name = products_data[0].category_name
          product_items_model.set_category_name(category_name)
          let sorting_details = await get_sorting_options(category_name)
          product_items_view.display_sorting_options(sorting_details , this.get_data_by_price_brand )
          product_items_view.display_product_items(products_data , this.add_listeners)
     }
     
     async get_data_by_price_brand()
     {
          let res = await product_items_model.get_clicked_brand_price_names();
          let { selected_brands  ,selected_prices , category_name } = res 
          reload_page( CURRENT_PAGE,   res )
     }

}

const product_item_controller = new Product_Items_Controller();

function initialize(){
product_item_controller.render()
}

async function handle (selected_brands, selected_prices , category_name) 
{

     let response = await  product_items_model.get_price_brand_based_products(  selected_brands,   selected_prices ,  category_name)
   
     product_item_controller.render( response )

}

function is_prices_based_params ( url_params ) { 

     let selected_brands = null , selected_prices = null ; let category_name = null 

     let flag = false ;

     for ( let [keys] of url_params )
     {
          if ( keys.indexOf("selected")!= -1 || keys.indexOf("category") != -1 )
          {
            //   alert('found')
               flag = true ;
          }
     }

     if ( !flag )
     {
         // alert('uri not related to this ')
          return false ;
     }
     
     try{
     [ selected_brands , selected_prices , category_name ] =  url_params.values()
     }
     catch( error ) 
     {
          alert( error)
     }

     //array is parsed into string seperated by the comma 
     if ( selected_brands != ''){
     selected_brands  = selected_brands?.split(",")
     }
     
     if ( selected_prices != '')
     {
          selected_prices = selected_prices.split(",").map( (ele) => {return Number.parseFloat(ele)})
     }

     return { selected_brands ,  selected_prices ,  category_name}
}

function is_input_based_params( uri_params ) { 

     let flag = false;
     for ( let keys of uri_params )
     {
          if ( keys.indexOf("input")!= -1)
          {
               flag = true;
          }
     }

     if ( !flag )
     {
         // alert('not input based')
          return flag
     }
     
     //query strings are placed with in the array strings  so the comma seperator is used to split the keywords
     let [entered_value]= uri_params.values()

     return entered_value.split(",");

}


async function render_input_based_data ( user_input)
{

     let response = await send_data( user_input )      

     product_item_controller.render(response)
}

window.onload = () => {

     login_status_init()
     
     let current_url = window.location.href 
     console.log ( current_url)

     let url_params = new  URLSearchParams(location.search)
     
     let category_name = 'laptops'

     if ( url_params == '')
     {
          initialize()
          return;
     }

     let res = false ;

     res  = is_prices_based_params( url_params )

     if ( res != false ) 
     {
          handle(res.selected_brands ,  res.selected_prices , res.category_name)

          return;
     }

    res = is_input_based_params( url_params)

    if ( res != null )
    {
          render_input_based_data( res )
     }

}
