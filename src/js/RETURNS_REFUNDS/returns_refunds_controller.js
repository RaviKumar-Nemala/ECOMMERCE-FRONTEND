import { has_jwt, transfer_page , divert_page , get_auto_suggestions_data  } from "../FIRST/Utils.js";
import {Product_Returns_Model } from "./returns_refunds_model.js";
import { Product_Returns_View } from "./returns_refunds_view.js"
import { login_status_init } from "../HEADER_SECTION/header.js";
import { store_brand_category_names } from "../HEADER_SECTION/input_based_search.js";
const PRODUCT_PG_URL = '../PRODUCT_FOCUS/product_focus.html'

class Product_Returns_Controller
{
     #product_returns_model ;
     #product_returns_view;

     constructor () 
     {
          this.#product_returns_model =  new Product_Returns_Model();
          this.#product_returns_view = new Product_Returns_View() ;
     }

     add_listeners (  ) 
     {
          let returns_list = document.querySelector( '.container  .returns_list')    
          let items =  returns_list.getElementsByClassName('return_item');
          items = Array.from ( items ) ;
          
          items.forEach(item => {
               item.addEventListener(  'click' , (e ) =>
               {
                    // divert_page( PRODUCT_PG_URL, )
                    item.querySelector('.bottom_section').addEventListener('click',(e)=>
                    {
                      let product_uuid = item.querySelector('.product_img').src ;
                      let category_name = item.dataset.category_name
                      let order_date =  item.dataset.order_date ;
                      let order_time = item.dataset.order_time;
                         divert_page( PRODUCT_PG_URL ,product_uuid , category_name ) 
                    })
               })
          })
     }
     async init () 
     {
          let jwt_token =  has_jwt();
          if( jwt_token == null )
          {
               alert('please login to your account ');
               return;
          }
          let suggenstions_data = await get_auto_suggestions_data();
          store_brand_category_names( suggenstions_data)
          let data =  await  this.#product_returns_model.fetch_cancel_ord_details(   jwt_token )
          this.#product_returns_view.render_product_details (  data  , this.add_listeners) ; 
     }
}



let controller = new Product_Returns_Controller();

window.onload = (e)=>
{
     controller.init();
     login_status_init();
}

