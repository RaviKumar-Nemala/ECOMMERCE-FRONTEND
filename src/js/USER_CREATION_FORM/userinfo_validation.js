import { send_data_to_server } from "./user_data_sender.js";
import { has_payment_request_params}  from './user_creation_form.js'
const password_min_length   =  5 
const OTP_PAGE_URL =  "../USER_OTP_FORM/user_otp_form.html"

function has_small_letters(content) {
     return content.match(/[a-z]/) ? true : false
}
function has_capital_letters(content) {
     return content.match(/[A-Z]/) ? true : false
}
function has_white_spaces(content) {
     content.trim();
     console.log(content.length)
     return /.*\s.*/.test(content);
}

function has_special_characters(content) {
     return (/[!@#\$%\^&\*\(\)]/).test(content) ? true : false
}

function has_numbers(content) {
     return (/^[0-9]$/).test(content) ? true : false
}

function is_empty ( name )
{
     return name.length ==  0 ? true : false
}

function check_length ( name , min_length )
{
     return name.length <  min_length ? false : true;
}

//nick name should not contain any special characters 
function display_specific_error ( target_div  , message )
{
     let sepcific_error =  target_div.querySelector('.specific_error_displayer');
     console.log (sepcific_error)
     sepcific_error.style.display =  'block';
     sepcific_error.textContent =  message;
}    

function display_red_border ( target_div )
{
     target_div.setAttribute("style", "border-width: 2px")
}

function display_valid_instructions  ( target_div ) 
{
     target_div.querySelector('.error_displayer').style.display =  'block'
}

function is_valid_nick_name (  nick_name )
{
          const min_length = 3;
          let nickname_div =  document.querySelector('.full_name_div')
          let nickname_input_element =  document.querySelector ( '.full_name_div  input')
          let error_msg = null; 

          if ( nick_name.length >=3 && !has_special_characters(nick_name))
          {
               return true; 
          }
          else {
                    display_valid_instructions( nickname_div)
                    display_red_border(nickname_input_element)
     
          if( is_empty( nick_name) ) 
         {
               error_msg = 'name should not be empty'               
               display_specific_error(nickname_div , error_msg )
          }
          else if(  !check_length  ( nick_name ,  min_length ) )
          {
               error_msg = 'name should contain  atleast 3 characters';
               display_specific_error(nickname_div , error_msg )
          }
          else if ( has_special_characters(nick_name))
          {    
               error_msg =  'name should not contain any special characters'
               display_specific_error( nickname_div ,  error_msg)
          }
          return false ;   
     }
}
function is_valid_email( email )
{
     const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     let email_div =  document.querySelector('.email_div')
     let email_input_element = email_div.querySelector('input')
     var email_correction_result = email_pattern.test(email)
     let msg  = "invalid email"
     if (email_correction_result) {
          console.log('valid email ')
          return true;
     }
     else {
          display_specific_error(email_div , msg)
          display_red_border(email_input_element)
          return false; 
     }
}
function is_valid_password ( password_value ) 
{
          const password_regx = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,20})");
          let password_div =  document.querySelector('.password_div')
          let password_input_element = password_div.querySelector('input')
     
          let msg = null;

         // alert('inside password validation')
          
          if ( password_regx.test(password_value) ) {
               console.log('success password_value')
               return true;
          }
          else {
               console.log('wrong password')
               display_red_border(password_input_element);
               display_valid_instructions(password_div)
                    if (password_value.length < 6) {
                         msg = 'password should contain atleast 6 charactes';
                         display_specific_error(password_div ,  msg)
                    } 
                    else if (has_white_spaces(password_value)) {
                         msg = 'password does not contain white spaces'
                         display_specific_error(password_div ,  msg)
                    }
                    else if (!has_small_letters(password_value)){
                         msg = 'password contain atleast one lower case letter'
                         display_specific_error(password_div ,  msg)
                    }
                    else if (!has_capital_letters(password_value)) {
                         msg = 'password contain at least one uppercase letter'
                         display_specific_error(password_div ,  msg)
                    }
                    else if (!has_special_characters(password_value)) {
                         msg = 'password contain one special character'
                         display_specific_error(password_div ,  msg)
                    }
                    else if (!has_numbers(password_value)) {
                         msg = 'password contain atlast one number'
                         display_specific_error(password_div ,  msg)
                    }
     
               return false;
               }
}
function is_valid_confirm_password ( password , confirm_password )
{
     let conform_password_element =  document.querySelector('.confirm_password_div')
     let conform_password_input_element = conform_password_element.querySelector('input')
     if ( password === confirm_password ) 
     {
          console.log ( 'both passwords are matched')
          return true ;
     }
     else 
     {
          let msg = "password and confirm password should be matched"
          display_specific_error(conform_password_element , msg)
          display_red_border ( conform_password_input_element)
          return false ;
     }
}

function divert_to_otp_page (  query_str = null )
{
     if ( query_str == null )
          window.location.replace(OTP_PAGE_URL);
     else 
          window.location.replace( OTP_PAGE_URL +  query_str ) ; 
}

function store_otp_waiting_time  ( waiting_time )
{
     localStorage.setItem("otp_resend_time" ,waiting_time )
}

//if the server validatas the email id correctly 
//then it sends the otp to the specified email
//then it sends  200 response to front end
//after getting the 200 response then store these userdeails in the session storage
async function handle_response ( response  , user_details)
{         
     if ( response.ok)
     {    
          store_in_session( user_details ) ;          
          let res = has_payment_request_params( );
          console.log(res)
          if( res != null )
          {
               let query_str =  `?make_payment=`+ encodeURIComponent( JSON.stringify( res )) ;
               divert_to_otp_page ( query_str ) 
          }
          else 
               divert_to_otp_page () ;
     }
     else 
     {
          console.log ( ' BAD RESPONSE')
     }
}

function store_in_session(user_details){
     sessionStorage.setItem("email" ,  user_details.email);   
     sessionStorage.setItem("nick_name" ,user_details.nick_name)  
     sessionStorage.setItem("password" , user_details.password)
     return;
}

async function helper ( entered_vals )
{
     const nick_name_valid_status =  is_valid_nick_name (  entered_vals.nick_name ) 
     const email_valid_status = is_valid_email (  entered_vals.email)
     const password_valid_status = is_valid_password ( entered_vals.password )
     const confirm_password_valid_status = is_valid_confirm_password ( entered_vals.password , entered_vals.confirm_password)

     if ( nick_name_valid_status && email_valid_status &&  password_valid_status  && confirm_password_valid_status )
     {
         let response = await send_data_to_server( entered_vals.email);
         handle_response ( response , entered_vals) ;
     }
}

//user_info contains the parent divs of the input elements 
export function validate_entered_values(user_info)
{
     let nick_name  =  user_info.name_div.querySelector('input').value
     let email =  user_info.email_div.querySelector('input').value
     let password =  user_info.password_div.querySelector('input').value
     let confirm_password = user_info.confirm_password_div.querySelector
     let entered_vals =  { nick_name : nick_name , email : email , password : password , confirm_password : confirm_password};
     helper ( entered_vals )
}