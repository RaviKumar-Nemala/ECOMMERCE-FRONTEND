import { get_jwt } from "./user_jwt_helper.js"
import { Payments } from "../PAYMENTS/payments.js"

const print_elements = (element) => console.log(element)

const   product_page_url  =  '../index.html'

const sign_up_page_url = "../USER_CREATION_FORM/user_creation_form.html"

const forget_password_page = '../FORGET_PASSWORD_EMAIL_FORM/Forget_Password_Email.html'

let ordered_prd_details =  null;

function alert_message(message) {
     alert(message)
}

let username_element = document.querySelector('.username');

let password_element = document.querySelector('.password');

let sign_in_element = document.querySelector('.sign_in')

let login_error_display_element =  document.querySelector ( '.login_error_displayer')

let sign_up_element =  document.querySelector('.sign_up')

let lost_password_btn =  document.querySelector('.lost_password')

function handle_username(username) {
     if (username == null || username.length <= 3) {
          alert_message('user name should not be the empty')
          return false;
     }
     else
          return true;
}

function handle_password(password) {

     if (password == null || password.length <= 3) {
          alert_message('password value should not be the empty')
          return false;
     }
     else
          return true;
}

sign_in_element.addEventListener('click', (e) => {
     console.log('button has pressed ')

     let username = username_element.value;

     let password = password_element.value;

     const res_1 = handle_username(username)

     const res_2 = handle_password(password)


     if (res_1 && res_2) {
          // alert_message(' user name and the password are  OK')
          get_jwt_util(username, password)
     }

}

)

sign_up_element.addEventListener('click' ,  (e) =>
{
     //alert( 'sign up element  has clicked' ) 
     if( ordered_prd_details != null ){
     let query_str  = `?make_payment=`+ encodeURIComponent( JSON.stringify( ordered_prd_details))
     divert_page( sign_up_page_url , query_str);
     }
     else {
     divert_page( sign_up_page_url  );
     }
}
)



lost_password_btn.addEventListener('click' , (e)=>
{
     //alert( 'clicked')
     divert_page ( forget_password_page )
}

)

function handle_payments( jwt_token )
{
     
     if( ordered_prd_details  != null )
     {
          ordered_prd_details.forEach((curr_obj)=>
          {
               curr_obj.jwt_token = jwt_token ;
          })
     }
     console.log( ordered_prd_details ) ;

     let payments  = new Payments () ;

     const from_login_pg =  true ; 

     payments.bulk_initialize_payment( ordered_prd_details, from_login_pg );

}

function remove_carts_from_ls( )
{
     localStorage.removeItem("cart_details")
}

async function get_jwt_util(username, password) {
     let response = await get_jwt(username, password)
     
     let jwt_token = null;

     let error_message = null ; 

     let response_message =  await response.text();
     
     if (response.ok) {

          jwt_token =  response_message ;
     
          set_jwt_token( jwt_token ) ; 

          remove_carts_from_ls();
          
          if ( ordered_prd_details != null )
          {
               handle_payments(jwt_token );
          }
          else 
          {
               
               divert_page(product_page_url)
          }
     }    
     else {
          error_message =  response_message ;
          console.log ( error_message ) ; 
          display_error_msg( error_message ) 
     }

}

function set_jwt_token (  jwt_token )
{
     localStorage.setItem("jwt_token" ,  jwt_token )  
}

function  display_username_border(  )
{
     document.querySelector('.username_div').classList.add('input_focus')

}

function display_password_border () 
{   
     document.querySelector ( '.password_div').classList.add( 'input_focus')
}


function  display_error_msg(  message ) 
{
     message =  message.trim() 
     
     login_error_display_element.textContent = message ; 
     
     login_error_display_element.classList.add('display_error')
     
     // display_username_border()

     // display_password_border( )


}

function  divert_page (  url  , url_params  = null  )
{
     if (url_params != null )
     {    
          url = url + url_params ;
     }

     console.log (  url ) ; 

     window.location.assign( url  )
}



window.onload =  (e)=>
{
     let url  = new URL( window.location );

     let data = url.searchParams.get('make_payment');

     if( data != null )
     {
         ordered_prd_details =  JSON.parse( data );   
     }

}






