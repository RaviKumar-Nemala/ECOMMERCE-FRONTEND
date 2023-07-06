import { get_jwt, has_jwt , get_auto_suggestions_data,divert_page,get_uuid_val  } from "../FIRST/Utils.js";
import { Carts_Model } from "./Carts_Model.js";
import { Carts_View } from "./Carts_View.js";
import { Payments } from "../PAYMENTS/payments.js";
import { login_status_init } from "../HEADER_SECTION/header.js";
import { store_brand_category_names } from "../HEADER_SECTION/input_based_search.js";

const SPECIFIC_PRODUCT_PAGE  = '../PRODUCT_FOCUS/product_focus.html'
let payments = null; 
const LOGIN_PAGE = '../USER_LOGIN_FORM/user_login_form.html';
let carts_model = new Carts_Model();
let carts_view = new Carts_View()
let carts_controller = null

class Carts_Controller {

     #carts_data = null
     
     //map contains the key as the index of the array and  value as the object ( quantity , total_price )
     // this map is useful for  calculating the total price and the number of items that the user has selected
     #price_map =  new Map() ;
     
     //if the quantity value has changed then need to recalculate the subtotal 
     // this method useful for that
     #update_price_map (  idx , details )
     {
          idx = Number.parseInt  ( idx ) ;
          this.#price_map.set( idx ,  details ) ;
          this.display_subtotal  () ; 
     }

     //during the loading the cart detals we need to calculte the subtotal values 
     store_in_price_map ( idx , details )   
     {
          carts_controller.#price_map.set( idx , details ) ;  
     }

     #activate_quantity_listener()
     {
          let carts_container =  document.querySelector('.box  .carts_container');
          let cart_items = carts_container.getElementsByClassName('cart_item')          
          cart_items = Array.from( cart_items) ;

          cart_items.forEach(  ( curr_item ) =>
          {
               let bottom_section = curr_item.querySelector('.bottom_section')

               let select_tg = bottom_section.querySelector( 'select')

               select_tg.addEventListener( 'change' , (e)=>
               {
                    let quantity  = e.target.value ;
                    let product_uuid =  curr_item.querySelector('.cart_img img').src;
                    product_uuid   = get_uuid_val ( product_uuid ) ; 
                    quantity  = Number.parseInt ( quantity) ; 
                    let target_div = bottom_section ; 
                        carts_model.update_quantity( quantity , product_uuid ) 
                    carts_controller.#calculate_subtotal ( target_div ,  quantity )
               })
          })
     }

     display_subtotal ( )
     {
          let total_price = 0 , quantity_val = 0 ;

          carts_controller.#price_map.forEach( (details, idx) =>
          {
               let { quantity , price } =  details ;
               total_price  += price ;
               quantity_val +=  Number.parseInt(quantity) ; 
          })
          carts_view.display_subtotal ( quantity_val , total_price )  
     }

     #calculate_subtotal ( target_div  , quantity_val )
     {
          quantity_val =  Number.parseInt ( quantity_val ) ; 
          const [idx_val] = target_div.id.split("_").splice(-1);
          const { products_details }  = this.#carts_data.at(idx_val)
          let { price } = products_details ;
          let details =  { 
               quantity :  quantity_val ,
               price :  price * quantity_val
          };
          this.#update_price_map ( idx_val,  details ) ; 
     }

     /**
      * uuid contains the path like  http:localhost:2022/uuid val
      * so we need to remove that and only take the actual uuid string from that
      */
     #get_removed_cart_uuid ( idx_val)
     {
          let product_item =  this.#carts_data[idx_val].products_details
          let { product_uuid} =   product_item
          let [product_uuid_val]=  product_uuid.split("/").slice(-1)
          return product_uuid_val
     }

     async init() {
          let data = await carts_model.get_cart_items()
          this.#carts_data = data
          let carts_listener = this.add_cart_item_listeners
          carts_view.display_cart_details(data, carts_listener ,  this.store_in_price_map  , this.display_subtotal)
     }

     #remove_cart_item(idx_val)
     {
          this.#carts_data.splice(idx_val,1)
     }

     #render_carts()
     {
          this.#price_map.clear();
          carts_view.display_cart_details( this.#carts_data ,  this.add_cart_item_listeners , this.store_in_price_map  , this.display_subtotal )
     }

     #is_temp_user () 
      {
          return !has_jwt();
      }

     remove_cart_from_storage ( idx_val  )
     {
          let  temp_carts_data = JSON.parse(localStorage.getItem ( "cart_details") ) ; 
          temp_carts_data.splice(idx_val , 1 );
          localStorage.setItem("cart_details" ,  JSON.stringify(temp_carts_data));
     }
     #remove_btn_util ( remove_btn)
     {
          const id_val = remove_btn.id;
          const idx_val = Number.parseInt(id_val.split("_").slice(-1))
          const product_uuid =  this.#get_removed_cart_uuid  (  idx_val ) 
          carts_model.remove_cart ( product_uuid )
          this.#remove_cart_item( idx_val)

          if ( this.#is_temp_user ()  ) 
          {
               this.remove_cart_from_storage ( idx_val)
          }
          this.#render_carts( )
     }

     #activate_remove_btn_listener()
          {
               let remove_btns_list = document.getElementsByClassName('cart_remover')

               for( let remove_btn of remove_btns_list )
               {
                    remove_btn.addEventListener('click', (e)=>
                    {
                         console.log ( remove_btn ) 
                         carts_controller.#remove_btn_util(remove_btn)
                    })
               }
          }
          #handle( target_div ){
          const [idx_val] = target_div.id.split("_").splice(-1);
          const { products_details }  = this.#carts_data.at(idx_val)
          const{ product_uuid , category_name }  = products_details ;
          console.log( product_uuid , category_name)
          divert_page(SPECIFIC_PRODUCT_PAGE , product_uuid ,  category_name )
          }

          #activate_name_listener ( )
          {
               let carts_container   = document.querySelector ('.box .carts_container')
               let cart_items = carts_container.getElementsByClassName('cart_item')
               cart_items = Array.from( cart_items ) ;
               cart_items.forEach( ( curr_item) =>
                {
                    let p_name_div =  curr_item.querySelector('.cart_details .product_name');
                    let img_div = curr_item.querySelector ( '.cart_img')
                    let product_uuid = curr_item.querySelector('.cart_img img').src ;
                    product_uuid = get_uuid_val( product_uuid );
                    let  category_name  = curr_item.dataset.category_name ;
                    p_name_div.addEventListener('click' , (e) =>
                    { 
                         divert_page  ( SPECIFIC_PRODUCT_PAGE  , product_uuid , category_name );
                    })

                    img_div.addEventListener ( 'click' , (e) =>
                    {
                         divert_page (  SPECIFIC_PRODUCT_PAGE ,product_uuid , category_name )
                    })
                }
                
               )
          }

          //not for getting the cart details from the database
          //when the user clicked on the buy now then  we need
          //to extract the product_uuid , quantity ,  this helps for that
          #get_items()
          {
               let carts_container =  document.querySelector('.box  .carts_container');
               let cart_items = carts_container.getElementsByClassName('cart_item')
               cart_items = Array.from( cart_items) ;
               let obj_list = [];
               let jwt_token = get_jwt()
               let payment_req_list  =  new Array();
               cart_items.forEach(  ( curr_item ) =>
               {
                    let img = curr_item.querySelector('.cart_img img');
                    let product_uuid = img.src; 
                    //above uuid is in the format of the http://localhost:2022 like this
                    // need to remove http://localhost:2002 
                    product_uuid   = get_uuid_val(  product_uuid ) ; 
                    let quantity_val = curr_item.querySelector('.quantity_options select').value;
                    // console.log( quantity_val , product_uuid);
                    
                    let obj  = {
                         product_uuid :  product_uuid,
                         quantity : quantity_val
                    }
                    if( jwt_token !=null )
                    {
                         obj.jwt_token = jwt_token
                    }
                    payment_req_list.push( obj ) ;
               }
               )
             
               if ( jwt_token != null )
               {
               payments.bulk_initialize_payment( payment_req_list);
               }
               else 
               {
                    const query_str =  "?make_payment="+ encodeURIComponent(JSON.stringify(payment_req_list));       
                    const target_url =  LOGIN_PAGE  + query_str 
                    window.location.assign(target_url);
               }
          }
          #activate_proceed_to_buy_btn()
          {
               let buy_btn =  document.getElementsByClassName('buy_btn');
               if( buy_btn.length == 0 )
                    return;    

                    buy_btn  = Array.from( buy_btn ).at(0);
               buy_btn.addEventListener('click',(e)=>
               {
                    this.#get_items()
               })
          }
          add_cart_item_listeners()
          {
               carts_controller.#activate_quantity_listener() ;
               carts_controller.#activate_remove_btn_listener()
               carts_controller.#activate_name_listener();
               carts_controller.#activate_proceed_to_buy_btn() ;
          }
          async get_suggestions_data()
          {
               let response = await get_auto_suggestions_data();    
               store_brand_category_names(response);
          }
}

carts_controller = new Carts_Controller()

window.onload = () => {
     login_status_init()
     carts_controller.get_suggestions_data();
     carts_controller.init();
     payments  = new Payments () ;
     payments.load_rzp_script();
}