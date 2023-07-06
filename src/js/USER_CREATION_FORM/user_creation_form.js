import {validate_entered_values } from './userinfo_validation.js'

let name_element =  document.querySelector  ( '.full_name_div')

let email_element = document.querySelector ( '.email_div')

let password_element =  document.querySelector ( '.password_div')

let confirm_password_element = document.querySelector ( '.confirm_password_div')

let existing_account_button =  document.querySelector ( '.existing_account');

let create_account_button = document.querySelector ( '.create_account')

const  login_page_url =  "../USER_LOGIN_FORM/user_login_form.html"

function divert_page ( url ) 
{
     window.location.assign( url ) 
}

existing_account_button.addEventListener('click' , (e)=>
{
     let res =  has_payment_request_params();

     if ( res  != null )
     {
          let query_str  = `?make_payment=`+ encodeURIComponent(JSON.stringify(res));
          let page_url = login_page_url + query_str ;
          divert_page( page_url )
     }
     else 
         divert_page ( login_page_url ) 
}
)

export function has_payment_request_params( )
{
     let url  = new URL(window.location);

     let details = url.searchParams.get('make_payment');
     
     if ( details != null )   
     {

          return JSON.parse( details ) ;
     }    

     return details ;
}

create_account_button.addEventListener ( 'click' ,  ( ) => 
{

     console.log(  name_element ,  email_element , password_element ,  confirm_password_element  ) 
     
     let user_info  = 
     {
          name_div:  name_element ,

          email_div: email_element ,

          password_div: password_element ,

          confirm_password_div :  confirm_password_element 

     }

     validate_entered_values (  user_info)

} 

)
     


