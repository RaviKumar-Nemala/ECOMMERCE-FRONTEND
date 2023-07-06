import {get_current_product_info } from './product_focus.js'

import { add_to_cart_db } from './carts_db_storage.js'

let add_to_cart_btn =  document.querySelector('.cart_btn');

//console.log ( add_to_cart_btn )

function store_cart_item ( product_item )
{

     if ( localStorage.getItem("carts") == null )
     {
          localStorage.setItem("carts","[]")
     }
     let carts_data  = JSON.parse(localStorage.getItem("carts"))

     carts_data.push ( product_item)

     localStorage.setItem("carts" , JSON.stringify(carts_data ))

     console.log ( carts_data)
     
}


//if we have the jwt token in our localstorage then
// store the user cart details in the data base 

function get_jwt()
{

     let jwt_token   = localStorage.getItem("jwt_token");

     return jwt_token;

}

function parse_product_uuid ( product_uuid )
{

     let values =  product_uuid.split("/")

     console.log( values)

    let size =  values.length 

    //it is the uuid excluding the (http://locals ....)

     const actual_uuid = values[size-1]

     return actual_uuid;

}



function util () {
     
     //alert('util')

     let product_data  =  get_current_product_info();

     let jwt_token = get_jwt ();

     if ( jwt_token == null )
     {
          
     }
     else 
     {
          console.log( 'printing the jwt token  ');

          console.log ( jwt_token )

          let _actual_product_uuid =  parse_product_uuid(product_data.main_img_uuid)

          alert(_actual_product_uuid )

          let product_cart_details = 
          {
               product_uuid  : _actual_product_uuid, 

               total  : product_data.price,

               quantity : 1

          }

          add_to_cart_db( jwt_token ,product_cart_details)

     }


     store_cart_item(product_data)


}



function start_listeners () {

  //   alert('start_listeners')


     add_to_cart_btn.addEventListener('click' ,  util);

}


start_listeners();

