import { has_jwt  } from "../FIRST/Utils.js";
import { Orders_Model } from "./orders_model.js";
import { Orders_Items_View } from "./orders_view.js";
import { divert_page, BASE_URL } from "../FIRST/Utils.js";
import { login_status_init } from "../HEADER_SECTION/header.js";
import { get_auto_suggestions_data } from "../FIRST/Utils.js";
import { store_brand_category_names } from "../HEADER_SECTION/input_based_search.js";
const PRODUCT_PG_URL = '../PRODUCT_FOCUS/product_focus.html'

class Orders_Controller
{
     #order_model;
     #order_view;
     constructor()  
     {
          this.#order_model = new Orders_Model();
          this.#order_view = new Orders_Items_View();
     }
     async #cancel_order ( product_uuid , order_date , order_time )
     {
         let data = await this.#order_model.cancel_order(order_date ,  order_time ,  product_uuid);
         
     }
     add_listeners()
     {
        let orders_list  = document.querySelector('.container .orders_list');
        let order_items = orders_list.querySelectorAll('.order_item');
        order_items = Array.from( order_items );

        order_items.forEach((item) =>
        {
             item.querySelector('.bottom_section').addEventListener('click',(e)=>
             {
               let product_uuid = item.querySelector('.product_img').src ;
                  
               let category_name = item.dataset.category_name

               let order_date =  item.dataset.order_date ;

               let order_time = item.dataset.order_time;

               if ( e.target.className === 'cancel_ord')
               {
                    controller.#cancel_order(product_uuid , order_date ,order_time);
               }
               else 
               {    
                    divert_page(PRODUCT_PG_URL,product_uuid , category_name);
               }
          })
        })
     }
     
     async init()
     {
          let jwt_token =  has_jwt();
          if( jwt_token == null )
          {
               alert('please login to your account ');
               return;
          }
          let suggenstions_data = await get_auto_suggestions_data();
          store_brand_category_names( suggenstions_data)
          let data = await this.#order_model.fetch_order_details( jwt_token) ; 
          console.log (data );
          this.#order_view.render_order_details( data , this.add_listeners) ;     
     }    
}

let controller = new Orders_Controller();

window.onload = (e)=>
{
     controller.init();
     login_status_init();
}