import {get_category_products} from './product_category.js'

// then take the number which is an id  

function divert_page (product_info) 
{
     //alert( 'hello')

     localStorage.setItem("product_name" , product_info.product_name);

     localStorage.setItem("price" , product_info.price );

    let  product_side_images = JSON.stringify(product_info.product_side_images)

     let product_specifications =  JSON.stringify(product_info.product_specification);
     
     localStorage.setItem("product_side_images" ,product_side_images)

     localStorage.setItem("spec" , product_specifications )

     localStorage.setItem("main_image_uuid" , product_info.product_uuid);
     // }
     //window.location.assign ("PRODUCT_FOCUS/product_focus.html")

     //window.location.assign("./product_focus.html")

     window.open("./product_focus.html")

   // window.location.href = "./product_focus.html"

//     window.location.assign();

    // display_left_content()
}



function get_idx( id_val )
{
     id_val  = id_val.split("").reverse().join("");
     
     console.log( id_val )

     let idx_val ='';

     for  ( let _letter of id_val )
     {
          if ( !isNaN(_letter) )
          {
               idx_val +=_letter;
          }
     }

     //console.log( idx_val)

     if ( idx_val === '')
          return null;

    idx_val =  idx_val.split("").reverse().join("");

    console.log(idx_val);

    return Number(idx_val ) ;
}

function  get_product_info (related_item_div) 
{

     let id_val = related_item_div.id

     let idx_val =  get_idx ( id_val )

     let total_products_info = get_category_products () 

     let clicked_product_info   = total_products_info[idx_val]


     divert_page (  clicked_product_info ) 

}

// once the data loaded then we add the event listeners to it
// product category.js  calls this function once it displays the data 

export function  add_listener ( )
{

     let parent_container = document.querySelector('.related_items_list')

     let related_items_list = parent_container.getElementsByClassName('related_item');


     for (  let related_item of related_items_list )
     {

          console.log ( related_item )

          related_item.addEventListener( 'click' ,  () =>
          {
            //   alert('hell')

               get_product_info ( related_item ) 
          })  

     }

}


//add_listener()
