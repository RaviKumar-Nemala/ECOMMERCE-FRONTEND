import { get_currency_options } from "../FIRST/Utils.js";

export class Product_Returns_View
{
     empty_list = document.querySelector( '.empty_list ') ; 
     items_list = document.querySelector('.container .returns_list')

     render_product_details ( product_details  , listeners) 
     {
          if ( product_details == null )
          {
               this.empty_list.classList.remove( 'hide');
               this.items_list.style.display = 'none'
               return; 
          }

          this.empty_list.classList.add('hide') 
          this.items_list.style.display = 'flex'
          let html = '';
          let counter = 0 ;
          for( let data of product_details ){
          let {product_name , price , product_uuid , order_date , order_time  , category_name} =  data;
          price = new Intl.NumberFormat("en-In" ,get_currency_options()).format(price)
          let dt = new Date( order_date );
          let li = document.createElement('li');
          li.className = "return_item"
          li.id = `return_item_${counter}`
          li.dataset.category_name = category_name;
          li.dataset.order_date = order_date;
          li.dataset.order_time = order_time;
          
          html = `<div  class = "top_section" > 
               <div  class ="order_date">
                    <div class = "ord_txt">CANCELED AT </div>
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
                    <button class = "buy_again">Buy Again</button>
                    <button class ="view_item">View Item</button>
                    </div>
               </div>
          </div>`

          counter ++;
          li.innerHTML=html;
          console.log ( li );
          this.items_list.appendChild(li);

     }
     listeners () ; 
}
}