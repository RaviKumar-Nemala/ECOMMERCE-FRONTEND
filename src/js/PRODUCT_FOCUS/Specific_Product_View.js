import { get_currency_options } from "../FIRST/Utils.js"

//in the down section it specifies how many  related_products has to be displayed
const RELATED_ITEMS_COUNT  = 10 ;
let msg_div =  document.querySelector('.msg_div');
export class Specific_Product_View {

     #side_imgs_list = document.querySelector('.product_image_div .product_side_image .side_img_list')
     #main_image_div = document.querySelector('.product_main_image_div')
     #realted_items_div_1 = document.querySelector('#related_items_list_1')
     #realted_items_div_2 =  document.querySelector('#related_items_list_2')

     #add_time_out(time_val , target)
     {
          window.setTimeout( ()=>
          {
               target.classList.add('hide')
          } , 1000)
     }

     #show_msg ( content, timeout_val , background_color)
     {
          msg_div.innerHTML = content;
          msg_div.classList.remove('hide');
          msg_div.style.backgroundColor = background_color;
          this.#add_time_out(timeout_val , msg_div);
     }

     show_cart_added_msg()
     {
          let str = `<p>item added into carts</p><i class="fa-solid fa-xmark"></i>`
          this.#show_msg( str , 1000 ,  'green'); 
     }    

     show_login_error_msg()
     {
          const str =  `<p>Please Login into your account</p> <i class="fa-solid fa-xmark"></i>` 
          this.#show_msg( str , 2000,  'red');
     }

     show_error_msg ( msg )
     {
          const str = `${msg}`
          this.#show_msg( str , 4000 , 'red');
     }
     show_expired_session_msg( login_status_displayer)
     {
          const str =  `<p>Your Session Has Expired Please Login Again </p> <i class="fa-solid fa-xmark"></i>`
          this.#show_msg( str , 3000 , 'red');
          login_status_displayer()
     }

     #set_extra_specifications(entries)
     {
          this.#extra_specifications = entries
         // alert('reached')
          let target_div = document.querySelector('#more_specifications')
          target_div.classList.add('disable')
          target_div.innerHTML = ''
          for( let [key, value] of entries ) 
          {
               let li = document.createElement('li');
               li.textContent = key + " : " + value;
               target_div.appendChild(li);
          }
     }

     #activate_side_image_listeners() {

          let side_imgs_list = this.#side_imgs_list.childNodes;

          for (let side_img of side_imgs_list) {
               let img_uuid ;
               side_img.addEventListener('mouseenter', (e) => {
                     img_uuid = side_img.firstElementChild.src;
                    this.#display_product_main_image(img_uuid)
               }
               )
               side_img.addEventListener('click',(e)=>
               {
                    img_uuid = side_img.firstElementChild.src;
                    this.#display_product_main_image(img_uuid) 
               })
          }

     }



     #display_product_main_image(image_uuid) {
          let src_image_div = this.#main_image_div.querySelector('.product_main_image');
          src_image_div.src = image_uuid;
     }
     #display_product_side_images(side_images_uuids) {
          let side_img_div = document.querySelector('.product_side_image')
          let side_img_list = side_img_div.querySelector('.side_img_list')
          let html = '';

          for (let side_img of side_images_uuids) {
               let { product_uuid } = side_img
               html +=
                    `<li class = "side_img">
                     <img src = ${product_uuid}>
                    </li>`
          }
          side_img_list.innerHTML = html;
          this.#activate_side_image_listeners();
     }

     display_more_specifications()
     {
         let target_div = document.querySelector('#more_specifications')
          target_div.toggle('disable')
     }
     #display_main_product_specifications(specifications_list , read_more_listener, read_less_listener) {
          let count = 0;
          let specification_element = document.querySelector('.specifications_content')
          let entries  = Object.entries(specifications_list)

          if ( entries.length>  5 )
          {
               this.#set_extra_specifications(entries.slice(5))
               entries =  entries.slice( 0 , 5)
          }
          for (let [key, value] of entries) {

               let li = document.createElement('li');
               li.textContent = key + " : " + value;
               specification_element.appendChild(li);
          }
          
          read_more_listener()
          read_less_listener()
     }

     #display_main_product_content(product_info , read_more_listener , read_less_listener) {

          let { product_name, price, product_specification, product_uuid, product_side_images } = product_info;
          let product_name_element = document.querySelector('.product_name')
          let product_price_element = document.querySelector('.product_price')
          product_name_element.textContent = product_name
          product_price_element.textContent = new Intl.NumberFormat("en-In",get_currency_options()).format(price)

          this.#display_main_product_specifications(product_specification ,  read_more_listener , read_less_listener)
          this.#display_product_main_image(product_uuid)
          this.#display_product_side_images(product_side_images)
     }

     display_product_info(product_info , cart_btn_listener , read_more_listener , read_less_listener , buy_now_btn_listener) {

          this.#display_main_product_content(product_info , read_more_listener , read_less_listener)
          cart_btn_listener()
          buy_now_btn_listener();
     }

     #display_first_section_related_items( related_items_info , idx )
     {
          let html = ''
          this.#realted_items_div_1.innerHTML = ''
          related_items_info = related_items_info.length > 10 ? related_items_info.slice(0,10) : related_items_info

          for (let item of related_items_info) {

               let { product_name, product_uuid, price } = item
               if ( product_name .length >= 40 )
          {
               product_name = product_name.slice ( 0 , 40 );
          }
          product_name = product_name + " ..."
               price = new Intl.NumberFormat("en-In" ,get_currency_options()).format(price)
               let li = document.createElement('li')
               li.id = `related_item_${idx}`
               li.className = `related_item`
               html =   `<div class="product_div">
                         <img class = "product_img blurr_img" src = "" data-src=${product_uuid}>
                         <p class = "product_name">${product_name}</p>
                         <h6 class = "product_price">${price}</h6>
                         <div class="btn_div">
                         <button>BUY NOW</button>
                         </div>
                    </div>`
               li.innerHTML = html;
               this.#realted_items_div_1.appendChild(li)
               idx++;
          }
          return idx;
     }

     #display_second_section_related_items ( related_items_info , idx ) 
     {    
          let html = ''
          related_items_info = related_items_info.length > 10 ? related_items_info.slice(0,10) : related_items_info
          for (let item of related_items_info) {
               let { product_name, product_uuid, price } = item
               if ( product_name .length >= 40 )
          {
               product_name = product_name.slice ( 0 , 40 );
          }
          product_name = product_name + " ..."

               price = new Intl.NumberFormat("en-In" ,get_currency_options()).format(price)
               let li = document.createElement('li')
               li.id = `related_item_${idx}`
               li.className = `related_item`
               html =   `<div class="product_div">
                         <img class = "product_img blurr_img" src = "" data-src=${product_uuid}>
                         <p class = "product_name">${product_name}</p>
                         <h6 class = "product_price">${price}</h6>
                         <div class="btn_div">
                         <button>
                         BUY NOW
                         </button>
                         </div>
                    </div>`
               li.innerHTML = html;
               this.#realted_items_div_2.appendChild(li)
               idx++;
          }
     }    
     #toggle_buttons ()
     {
          let read_more_btn =  document.querySelector('.read_more')
          read_more_btn.classList.toggle('disable')
          let target_div = document.querySelector('#more_specifications')
          target_div.classList.toggle('disable')
          let read_less_btn = document.querySelector('.read_less')
          read_less_btn.classList.toggle('disable')
     }
     display_more_specifications () 
     {
          this.#toggle_buttons()   
     }

     hide_more_specifications () 
     {
          this.#toggle_buttons()
     }
     display_related_products( similar_brand_products ,similar_category_products,  clicked_listeners_function) {
          let items_list_container = document.querySelector('.related_items_list')
          let idx = 0;
          let n1 =  similar_brand_products.length ;
          let n2 = similar_category_products.length 
          if ( n1 >= 4 && n2 >= 4 )
          {
              let last_idx = this.#display_first_section_related_items( similar_brand_products, 0 )
               this.#display_second_section_related_items(similar_category_products, last_idx)
          }
          else 
          {
               let data = [...similar_brand_products , ...similar_category_products]
               let total_size = data.length 
               let middle_idx  =total_size/2
               this.#display_first_section_related_items(data.slice(0 , middle_idx) ,  0)
               this.#display_second_section_related_items ( data.slice(middle_idx) , middle_idx)
          }
          
          clicked_listeners_function();
     }
}