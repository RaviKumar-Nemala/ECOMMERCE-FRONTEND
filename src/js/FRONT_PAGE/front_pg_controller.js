import { get_auto_suggestions_data, reload_page ,divert_page} from '../FIRST/Utils.js'
import { store_brand_category_names } from "../HEADER_SECTION/input_based_search.js";
import { Front_pg_Model } from './fornt_pg_model.js';
import { Front_Pg_View} from './front_pg_view.js'
import { login_status_init }  from '../HEADER_SECTION/header.js'

const category_container  = document.querySelector('.category_container');
const category_list = category_container.querySelector('.categories_list');
const  product_pg_url = '../FIRST/products_list.html'
const specific_product_pg_url = '../PRODUCT_FOCUS/product_focus.html'

const PHONES_CATEGORY = 'phones'
const LAPTOPS_CATEGORY = 'laptops'
const SHOES_CATEGORY = 'shoes'
const WATCHES_CATGORY = 'watches'
const SHIRTS_CATEGORY  = 'shirts' 

class Front_Pg_Controller
{

     #model;
     #view ;
     #SHOES_CATEOGORY_NAME = 'shoes'

     constructor()
     {
          this.#model = new Front_pg_Model();
          this.#view = new Front_Pg_View();
     }

     #transfer_page ( category_name)
     {
          if ( category_name == '' || category_name == ' ' || !category_name )
          {
               return;
          }          
          category_name = category_name.trim();
          reload_page( product_pg_url , { input : category_name});
     }

     //for testing purpose 
     // only works for the first section
     #add_scrolling_listeners( target )
     {         
          let items  = document.querySelectorAll( '.items');
          if ( items == null ) return; 
          items.forEach((curr_item) =>
          {
               const left_arrow = curr_item.querySelector('#left_arrow');
               const right_arrow = curr_item.querySelector('#right_arrow');
               const products_list = curr_item.querySelector('.products_list');
               const scroll_len =  products_list.getBoundingClientRect().width;
               left_arrow.addEventListener('click',(e)=> {
                    products_list.scrollBy(-scroll_len+28,0);
               })   
               right_arrow.addEventListener('click',(e)=>
               {
                    products_list.scrollBy(scroll_len-28 , 0 );
               })
          }
          )
     }

     #add_category_listeners()
     {
          let items = category_list.getElementsByClassName('category_item');
          for( let curr_item of  items )
          {
               curr_item.addEventListener('click' ,(e)=>
               {
                    console.log ( curr_item)
                    let category_name = curr_item.querySelector('.category_name').innerHTML;
                    this.#transfer_page(category_name)
               }
               )
          }
     }

     async #get_suggestions_data()
     {
          let response = await get_auto_suggestions_data();
          store_brand_category_names(response);
     }
     #add_product_listeners ()
     {
          let products_list =  document.querySelector('.container').querySelectorAll('.products_list');
          if( products_list == null || products_list.length == 0 )
               return;

          products_list =  Array.from( products_list);
          products_list.forEach((curr_list)=>
          {
          let items = curr_list.getElementsByClassName('product_item')
          items = Array.from( items )
          items.forEach((item) =>
          {
               item.addEventListener('click' , (e) =>
               {
                    let  img =  item.querySelector('img');
                    let product_uuid =  img.src; 
                    let category_name = item.getAttribute('data-category_name')
                    divert_page( specific_product_pg_url , product_uuid , category_name );
               })
          })
     })
}

     async #get_home_page_data()
     {
          let data = await this.#model.get_home_page_data();
          if ( data  == null )     return; 

          for ( const [ key , value ]  of Object.entries(data) )
           {
               if ( value == null )     continue;
               if ( key == `SHOES_CATEGORY`)
               {
                    this.#view.render_shoes_data(value);
               }
               else if( key == `PHONES_CATEGORY` )
               {
                    this.#view.render_phones_data(value);
               }
               else if( key == `WATCHES_CATGORY` )
               {
                    this.#view.render_watches_data(value);
               }
               else if ( key ==  `SHIRTS_CATEGORY`)
               {
                    this.#view.render_shirts_data(value);
               }
               else if( key == `LAPTOPS_CATEGORY`)
               {
                    this.#view.render_laptops_data(value);
               }
          }
          this.#add_product_listeners();
          this.#add_scrolling_listeners();
     }
     async  #get_shoes_data()
     {
       let data=await this.#model.get_data_by_category(this.#SHOES_CATEOGORY_NAME)

       console.log( data )
       if ( data == null )
          return; 
     
       this.#view.render_shoes_data( data , this.#add_product_listeners) ;

     }
     async #handle_electornics_data()
     {
         let data =  await this.#model.get_electornics_data();

         this.#view.render_electornics_data(data , this.#add_scrolling_listeners );
     }    
     init()
     {
     
     login_status_init();

     this.#add_category_listeners();  

     this.#get_suggestions_data();

     this.#get_home_page_data();
     // this.#handle_electornics_data();

     // this.#get_shoes_data();  
     
     // this.#get_watches_data();

     }
}


const controller =  new Front_Pg_Controller();

controller.init();
