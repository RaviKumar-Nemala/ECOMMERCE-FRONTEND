import { send_data } from "./forget_password_email_db.js";

let email_input  = document.querySelector( '.email_input')
let error_displayer =  document.querySelector ( '.error_displayer')
let submit_btn =  document.querySelector('.submit_btn')
const password_otp_page =  '../FORGET_PASSWORD_OTP_FORM/forget_passwd_otp.html'
function store_user_name(username)
{
     sessionStorage.setItem("email"  ,  username)
}

function divert_page (  ) 
{
     window.location.assign( password_otp_page ) 
}

function display_specific_error ( msg ) 
{
     error_displayer.textContent =  msg ;
     if( error_displayer.classList.contains('disable'))
     {
          error_displayer.classList.remove('disable')
     }
     error_displayer.classList.add('active')
}

function validate_email ( email_value ) {
const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var email_correction_result = email_pattern.test(email_value)
let msg  = "invalid email"
if (email_correction_result) {
     if ( error_displayer.classList.contains( 'active'))
     {
          error_displayer.classList.remove('active') 
     }
     error_displayer.classList.add('disable')
     return true;
}
else {
     display_specific_error(msg)
     return false; 
}

}

submit_btn.addEventListener('click' , (e) =>
{
     let email_value = email_input.value 
     if ( validate_email ( email_value )  ) {
     send_data ( email_value).then ( (response)=>
     {
          if  (response.ok)
          {         
               store_user_name ( email_value ) 
               divert_page (  ) ; 
          }
          else {
               return response.text()
          }
     }
     ).then (  ( response_text) =>
     {
          display_specific_error( response_text)
     })
     }
}
)