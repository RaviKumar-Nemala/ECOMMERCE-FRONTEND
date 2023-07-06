import { get_currency_options } from "./Utils.js"

let product_div =  document.querySelector('.products')
let apply_btn = document.querySelector('.Apply_btn_container .Apply_btn')
let brand_container = document.querySelector ( '.brand_container')
let price_container = document.querySelector ( '.price_range_container')

export class Product_Items_View
{
     async #activate_apply_btn( triggered_function)
     {
          apply_btn.addEventListener('click', (e)=>
          {
               triggered_function().then( (response) =>
               {

               })
               .catch ( )
               {
                    console.log ('SOMETHING WRONG WHILE FETCHING THE DATA')
               }
          })
     }

     #display_price_ranges(price_ranges)
     {
     
          if( price_ranges == null || price_ranges.length == 0 )
               return;    
          let price_container = document.querySelector('.price_range_container');
          let html = 'Price ';
          price_ranges.forEach((curr_val,idx) => {
               
          html += ` <div class ="price_item" id = "price_item_${idx}">
                         <input type = "checkbox" id  ="checkbox_${idx}">
                         <label for = "checkbox_1">${curr_val}</label>
                    </div>`
          });
          price_container.innerHTML =  html ;
     }

     display_sorting_options ( sorting_details , apply_btn_listener_function ) 
     {
          let {brand_names,price_ranges} = sorting_details;
          this.display_brand_names( brand_names )     
          this.#display_price_ranges( price_ranges);
          this.#activate_apply_btn(apply_btn_listener_function)
     }

     display_brand_names( brand_names) {
          let brand_container  = document.querySelector('.content_div  .sorting_container  .brand_container')
          
          let html = '';
     
          for ( let idx = 0 ;idx < brand_names.length ; idx ++){
     
               let brand_name = brand_names[idx]
              html += 
              `<div class ="brand_item" id = "brand_item_${idx}">
              <input type="checkbox" id = "checkbox_${idx}">
              <label  for = "checkbox_${idx}" >${brand_name}</label>
               </div>`
     }    
     brand_container.innerHTML = `Brand`+html

     }

     #handle_clicked_product( triggered_function)
     {
          triggered_function();
     }
     display_product_items( products_data , clicked_evnt_function )
     {
          let html = '';
          for( let idx = 0 ;idx < products_data.length ; idx ++)
          {
               html += this.#get_product_item_html( products_data[idx] ,  idx )
               console.log( html )
          }
          product_div.innerHTML = html
          this.#handle_clicked_product( clicked_evnt_function )
     }    
#get_product_item_html( data , idx )
{
     let {product_uuid , product_name ,  price } = data;
     price =  new Intl.NumberFormat("en-In", get_currency_options()).format(price)

     if ( product_name .length >= 40 )
     {
          product_name = product_name.slice ( 0 , 40 );
     }
     product_name = product_name + " ..."

     let html = 
               `<li class = "product_item" id=product_item_${idx}>
               <div class="product_div">
               <img class = "product_img" src = ${product_uuid } data-src=${product_uuid}>
               <p class = "product_name">${product_name}</p>
               <h6 class = "product_price">${price}</h6>
               <div class="btn_div">
               <button>BUY NOW</button>
               </div>
          </div>
           </li> `
     return html;
}

}