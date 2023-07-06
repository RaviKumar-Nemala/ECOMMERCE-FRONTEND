import { get_jwt , has_jwt , transfer_page } from "../FIRST/Utils.js";

const login_page_url = "../USER_LOGIN_FORM/user_login_form.html"
let user_login_status_div = document.querySelector('.user_login_status')
let options_btn = document.querySelector('.options_btn');
let total_account_options =  document.querySelector('.total_account_options');
let my_profile_element = document.querySelector('.account_options  .my_profile')
const ORDERS_PAGE_URL = '../ORDERS/orders.html'
const RETURNS_REFUNDS_URL = '../RETURNS_REFUNDS/returns_refunds.html'
const HOME_PAGE = '../index.html'

function remove_jwt() {
     if (localStorage.getItem('jwt_token'))
     localStorage.removeItem('jwt_token')
}
 
function add_order_listeners() {
     let order_elements = document.querySelectorAll('.header_container .orders')
     if( order_elements == null )
          return; 
     
     order_elements.forEach((curr_ele) =>
     {
          curr_ele.addEventListener('click', (e)=>
          {
               transfer_page( ORDERS_PAGE_URL)        
          })
     })
}

function add_return_listener () 
{
     let return_refund_eles  = document.querySelectorAll('.header_container .returns_refunds') ;
     if( return_refund_eles == null )
          return;

     return_refund_eles.forEach(curr_ele=>
          {
               curr_ele.addEventListener('click',(e)=>
               {
                    transfer_page( RETURNS_REFUNDS_URL); 
               })
          }
     )
}

function add_home_btn_listener()
{
    let home_btn =  document.querySelector('.header_container .home_btn')
     if( home_btn == null ) return ; 

    home_btn.addEventListener('click',(e)=>
    {
          transfer_page(HOME_PAGE)
    })
}

export function display_login_status( ) {
     if ( window.innerWidth <= 800 )
     {
          return;
     }
     let result = get_jwt();

     let content = ''

     if (result) {
          content = "My Account"
          user_login_status_div.innerHTML = `${content}`
          let child= document.createElement('div')
          child.className = 'account_options disable'
          child.innerHTML = 
         `<div  class = "orders">MY ORDERS</div>
         <div class = "returns_refunds">RETURNS & REFUNDS</div>
         <div class = "sign_out">SIGN OUT</div>`
         user_login_status_div.appendChild(child);
         add_order_listeners();
         add_return_listener();
         add_sign_out_listener();
     }
     else {
          content = "Login"
          user_login_status_div.innerHTML = `${content}`
          add_login_listener();
     }
} 
function add_login_listener()
{
     user_login_status_div.addEventListener('click',(e)=>
     {
          if( e.target.textContent == 'Login')
          {
               divert_to_login_page();
          }
     })
}

function change_text()
{
     let account_options = user_login_status_div.querySelector('.account_options');
     user_login_status_div.removeChild(account_options);
     user_login_status_div.innerHTML= `Login`;
     add_login_listener();
}

function add_sign_out_listener( )
{
      user_login_status_div.querySelector('.account_options').querySelector('.sign_out').addEventListener('click',(e)=>
     {
          remove_jwt();
          change_text();
     })
}

function divert_to_login_page() {
     window.location.assign(login_page_url);
}

function add_user_login_listeners(from = false) {

     if( from == true ){
     user_login_status_div.addEventListener('click', (e) => {

          if( user_login_status_div.textContent == 'Login')
          {
               divert_to_login_page();
          }
          else{
               alert('missed')
          }
     }

     )
}

}

function add_cart_listener() {
     document.querySelector('.carts_wrapper').addEventListener('click', (e) => {
          window.location.href = "../CARTS/carts.html"
     }
     )
     let btn = document.querySelector('.header_container  .total_account_options .carts')

     if ( btn == null )  return; 

     btn.addEventListener('click',(e)=>
     {
          window.location.href = "../CARTS/carts.html"
     })
}

function add_mobile_login_listener()
{
     total_account_options.querySelector('.login').addEventListener('click',(e)=>
     {
          divert_to_login_page();
     })
}
function util ()
{
     total_account_options.innerHTML = ``;
     total_account_options.innerHTML = 
     `<div class="carts">Carts</div>
     <div class ="login">Login</div>`
     total_account_options.classList.add('disable')
}
function add_mobile_signout_listener()
{
     total_account_options.querySelector('.sign_out').addEventListener('click',(e)=>
     {
          remove_jwt()
          util();
     })
}

export function login_status_init()
{
     add_home_btn_listener();

if( window.innerWidth > 500 ){
add_cart_listener()

display_login_status()
}
else
{

options_btn.addEventListener('click',(e)=>
{
    
     let html_1 =  ` <div class ="carts">Carts</div>
     <div class ="orders">My Orders</div>
     <div class ="returns_refunds">Returns&Refunds</div>
     <div class ="sign_out"> Sign Out</div>`

     let html_2 =  `<div class="carts">Carts</div>
                    <div class ="login">Login</div>`

     if ( has_jwt())
     {
          total_account_options.innerHTML = html_1;
          add_order_listeners();
          add_return_listener();
          add_mobile_signout_listener();
     }
     else 
     {
          total_account_options.innerHTML=  html_2;
          add_mobile_login_listener();
     }
     add_cart_listener();
     total_account_options.classList.toggle('disable');
})
}
}

