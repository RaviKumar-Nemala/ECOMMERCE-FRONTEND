import {retrive_category_products} from './CATEGORY_BASED_DATA/category_data_retrival.js'

import { add_listener } from './product_down_section.js'

let category_based_products ; 

function display_down_products ( products_list )
{

     let items_list_container = document.querySelector('.related_items_list')

    
     let idx = 0 

     for ( let product of products_list )
     {

          console.log ( product )

          console.log ( product.product_uuid )

          let li = document.createElement('li')
           li.id = `related_item_${idx++}`
           li.className=`related_item`
          let html =  `<div class="product_div">
          <img class = "product_img" src=${product.product_uuid}>
          <p class = "product_name">${product.product_name}</p>
          <h6 class = "product_price">${product.price}</h6>
          <div class="btn_div">
          BUY NOW
          </div>
     </div>`

          li.innerHTML = html ;
          items_list_container.appendChild(li);

          console.log (  li  );
     }

     add_listener()
     
}



export function  display_related_items (  category_name )
{
      retrive_category_products(category_name ).then((response) => 
     {
          
          category_based_products  = response ;

          display_down_products( response )

      })
     //display_down_products( products_list );
               
}

export function get_category_products() 
{
     return category_based_products ;    
}




