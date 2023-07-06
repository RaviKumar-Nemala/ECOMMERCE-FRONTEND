import { Specific_Product_Model } from "./Specific_Product_Model.js";
import { Specific_Product_View } from "./Specific_Product_View.js";
import { ERROR_MSG, divert_page, get_jwt, has_jwt } from "../FIRST/Utils.js";
import { get_auto_suggestions_data } from "../FIRST/Utils.js";
import { store_brand_category_names } from "../HEADER_SECTION/input_based_search.js";
import { Payments } from "../PAYMENTS/payments.js";
import  {login_status_init} from "../HEADER_SECTION/header.js"
import  { SESSION_EXPIRED_MSG , CART_SUCCESSFUL_INSERTION} from "../FIRST/Utils.js"
import { remove_jwt  } from "../FIRST/Utils.js";

const SPECIFIC_PRODUCT_PAGE = 'product_focus.html';
let specific_product_controller = null , payments =  null; 
let msg_div =  document.querySelector('.msg_div');

async function handle_auto_suggestions() {
          const json_response = await get_auto_suggestions_data()
          store_brand_category_names(json_response);
     }

function get_query_params (  )
{
     let query_str = location.search;
     let url_params = new URLSearchParams( query_str)
     let [uuid , category_name ] = url_params.values()
     return { uuid ,  category_name }
}

let specific_product_model = new Specific_Product_Model()
let specific_product_view = new Specific_Product_View()

class Specific_Product_Controller
{
       
     get_clicked_product_info ( product_item)
     {    
          let product_uuid = product_item.querySelector('img').src;
          let category_name = specific_product_model.get_category_name()
          return { product_uuid , category_name} 
     }

     handle_lazy_loading( )
     {
          let related_items_list = document.querySelectorAll('.related_items_list')    
          if  (related_items_list.length == 0 )
               return; 
          related_items_list = Array.from( related_items_list );

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
               }, {root : null , rootMargin:'100px'},
          )

          related_items_list.forEach((curr_section)=>
          {
               let imgs_list = curr_section.querySelectorAll('.product_img');
               if( imgs_list.length > 0 )
               {
                    imgs_list.forEach( (curr_img)=>
                    {
                         observer.observe( curr_img);
                    })
               }
          })

       
     }

     add_related_items_listeners()
     {
          specific_product_controller.handle_lazy_loading();
          let down_section =  document.querySelector('.down_section')
          let related_items_list =  down_section.querySelectorAll('.related_item')

          for (  let related_item of related_items_list )
          {
               related_item.addEventListener( 'click' ,  () =>
               {
                    let { product_uuid ,  category_name } = specific_product_controller.get_clicked_product_info ( related_item ) 

                    console.log( product_uuid  , typeof product_uuid )

                    divert_page( SPECIFIC_PRODUCT_PAGE ,product_uuid , category_name)
               })  
          }
     }
     get_related_brand_items ()  
     {
          return  specific_product_model.get_similar_brand_items()
     }

     get_similar_category_items () 
     {
          return specific_product_model.get_similar_category_items()
     }
     async init( )
     {
     handle_auto_suggestions () ;
     let { uuid , category_name } =  get_query_params() ;
     let response =    await specific_product_model.get_data_by_uuid ( uuid )
     specific_product_view.display_product_info( response ,  this.handle_clicked_cart  , this.handle_read_more_btn , this.handle_read_less_btn , this.handle_buynow_btn) 

     let response_2  = await specific_product_model.get_data_by_category(category_name)
     let brand_based_products  = specific_product_model.get_similar_brand_items()
     let category_based_products = specific_product_model.get_similar_category_items()

     specific_product_view.display_related_products( brand_based_products , category_based_products, this.add_related_items_listeners)

     }

     handle_clicked_cart() 
     {
          let add_to_cart_btn =  document.querySelector('.cart_btn');
          add_to_cart_btn.addEventListener('click',(e)=>
          {
               let product_uuid = specific_product_model.get_product_uuid()
               let price = specific_product_model.get_price()
               specific_product_model.store_cart_item( product_uuid , price )
               .then( (msg) =>
               {
                     if( msg ==  CART_SUCCESSFUL_INSERTION)
                     {
                         specific_product_view.show_cart_added_msg();
                     }
               })
               .catch( (msg) =>
               {
                    if (  msg == SESSION_EXPIRED_MSG)
                    {
                         remove_jwt();
                        specific_product_view.show_expired_session_msg( login_status_init );
                    }
                    else 
                    {
                        specific_product_view.show_error_msg( msg );
                    } 
               })
          }
          )
     }

     //if any temporary user( not-logged in  user) clicks on the 
     //buy now btn then then we need display the msg like please login to the account
     // after clicking on the ok then that error div will automatically closed
    
     handle_buynow_btn()
     {
          let btn  = document.querySelector('.buynow_btn');
          btn.addEventListener('click' , (e) =>
          {
               e.preventDefault();
               let product_uuid = specific_product_model.get_product_uuid () ;
               let jwt_token = get_jwt();

               if ( jwt_token == null )
               {
                    specific_product_view.show_login_error_msg();
                    return;
               }
               
               let quantity = 1 ; 

               //if jwt token is invalid or expired then 
               //ask the user to relogin to the page again to purchase the product
               let params = [] ; 
               
               params.push ({jwt_token, product_uuid , quantity }) ; 
               payments.bulk_initialize_payment( params )
               .then((msg)=>{
               }).catch( (msg)=>
               {
                    if( msg == SESSION_EXPIRED_MSG)
                    {
                         remove_jwt() ;

                         specific_product_view.show_expired_session_msg( login_status_init );
                    }
                    else if ( msg == ERROR_MSG)
                    {
                         specific_product_view.show_error_msg(msg);
                    }
               })
          })
     }

     handle_read_more_btn()
     {
          let read_more_btn = document.querySelector('.read_more')
          read_more_btn.addEventListener('click',(e)=>
          {
               specific_product_view.display_more_specifications()
          } )
     }
     handle_read_less_btn()
     {
               let read_less_btn = document.querySelector('.read_less')
               read_less_btn.addEventListener('click',(e)=>
               {
                    specific_product_view.hide_more_specifications() ;
               })          
     }

}

specific_product_controller = new Specific_Product_Controller()

window.onload = () =>
{
    specific_product_controller.init()
    login_status_init();
    payments =  new Payments();
    payments.load_rzp_script();
}
