import { get_currency_options } from "../FIRST/Utils.js";

export class Orders_Items_View
{
     no_orders = document.querySelector('.empty_list');
     orders_list = document.querySelector('.orders_list')
     render_order_details(  product_details , listeners )
     {
          if ( product_details.length == 0 )
          {
               this.no_orders.classList.remove( 'hide');
               this.orders_list.style.display ='none'
               return;
          }
          
          this.no_orders.classList.add('hide')
          this.orders_list.style.display = 'flex'

          let html = '';
          let counter = 0 ;
          for( let data of product_details ){
          
          let {product_name , price , product_uuid , order_date , order_time  , category_name} =  data;
          price = new Intl.NumberFormat("en-In" ,get_currency_options()).format(price)
          let dt = new Date( order_date );
          
          let li = document.createElement('li');
          li.className = "order_item"
          li.id = `order_item_${counter}`
          li.dataset.category_name = category_name;
          li.dataset.order_date = order_date;
          li.dataset.order_time = order_time;
          
          html = `<div  class = "top_section" > 
               <div  class ="order_date">
                    <div class = "ord_txt">ORDER PLACED </div>
                    <div  class ="ord_date_val" >${order_date}</div>
               </div>
               <div class ="amount_div">
                    <div class ="amount_txt">Total</div>
                    <div class ="amount_val">${price}</div>
               </div>
          </div>
          <div class ="bottom_section">
               <div class ="product_img_div">
                    <img  class ="product_img" src ="${product_uuid}">
               </div>
               <div class ="product_content">
                    <div class ="product_name">${product_name}</div>
                    <div class = "btns"> 
                    <button class = "write_review">Write a Review</button>
                    <button class ="cancel_ord">Cancel Order</button>
                    </div>
               </div>
          </div>`
          counter ++;
     li.innerHTML=html;
     console.log ( li );

     this.orders_list.appendChild(li);
}
     if( product_details.length > 0 )
     {
          listeners();
     }
     
     }
}