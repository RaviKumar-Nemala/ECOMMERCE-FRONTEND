import { get_currency_options } from "../FIRST/Utils.js";

let carts_container = document.querySelector('.box .carts_container')

export class Carts_View{
     #display_no_carts() {
          document.querySelector('.subtotal').classList.add('hide');
          let empty_carts_div = document.querySelector( '.empty_carts');
          document.querySelector('.box').style.display = 'none'
          empty_carts_div.classList.remove( 'hide');
          return;
     }

     display_subtotal ( quantity_val , price ) 
     {
          price =   new Intl.NumberFormat("en-In", get_currency_options()).format(price);
          let target_div = document.querySelector('.box .subtotal');
          let price_div = target_div.querySelector('.total_val');
          price_div.innerHTML = `<span >SubTotal( ${quantity_val} items) : </span> <span class ="price_val">${price}</span>`
     }

     display_cart_details(data, clicked_listeners , price_map_setter ,  sub_total_dispalyer ) {

          let html = ''
          let idx = 0;

          if (!data || data.length == 0) {
               this.#display_no_carts();
               return;
          }

          document.querySelector('.subtotal').classList.remove('hide');
          document.querySelector('.box').style.display = 'flex';
          carts_container.innerHTML = ''

          for (let curr_ele of data) {
               const { products_details  ,  quantity  } = curr_ele
               let { product_name, price, product_uuid , category_name } = products_details
               let price_currency =   new Intl.NumberFormat("en-In", get_currency_options()).format(price);
               let cart_item = document.createElement('div')
               cart_item.className = "cart_item"
               cart_item.id = `cart_item_${idx}`
               cart_item.dataset.category_name = category_name  ; 
               let html    =
                         `<div class ="cart_img">
                         <img src = ${product_uuid} >
                         </div>
                         <div class = "cart_details"> 
                              <div class ="product_name">${product_name}
                              </div>
                         <div class ="bottom_section" id = bottom_section_${idx}>
                              <div class ="quantity_options">
                                   <select>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value ="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                   </select>
                              </div>
                              <div class ="cart_remover" id = "cart_remover_${idx}">     
                                 <button> Remove </button>
                              </div>    
                         </div>
                    </div>

                    <div class ="price_details">
                         ${price_currency}
                    </div>
               </div>`

               cart_item.innerHTML = html ;

               let details = {  
                    quantity : quantity  ,
                    price  :   price*quantity 
               };
               price_map_setter  ( idx, details ) ;  
               if ( quantity >  1 )
               { 
                    cart_item.querySelector('select').value = quantity ;
               }
               carts_container.appendChild(cart_item ) ; 
               idx++;
          }
          sub_total_dispalyer ( ) ; 
          clicked_listeners()
     }

}