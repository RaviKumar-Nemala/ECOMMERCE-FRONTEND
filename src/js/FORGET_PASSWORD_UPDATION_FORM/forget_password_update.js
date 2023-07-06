import { send_data } from "./forget_password_update_db.js"

let password_div =  document.querySelector('.new_password_container')
let conform_password_div  = document.querySelector('.conform_password_container')
let submit_btn =  document.querySelector ( '.submit_btn')
const product_landing_page = '../index.html'
const JWT_TOKEN = "jwt_token"

function display_valid_instructions  ( target_div )
{
     target_div.querySelector('.error_displayer').style.display =  'block'
}

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

function display_specific_error ( target_div  , message )
{
     let sepcific_error =  target_div.querySelector('.specific_error_displayer');
     sepcific_error.style.display =  'block';
     sepcific_error.textContent =  message;
}    

function display_red_border ( target_div )
{
     target_div.setAttribute("style", "border-width: 2px ; color : red")
}

function is_valid_password ( password_value ) 
{
          const password_regx = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,20})");
          let password_div =  document.querySelector('.new_password_container')
          let password_input_element = password_div.querySelector('input')

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
     let conform_password_input_element = conform_password_div.querySelector('input')
     if ( password === confirm_password ) 
     {
          console.log ( 'both passwords are matched')
          return true ;
     }
     else 
     {
          let msg = "password and confirm password should be matched"
          display_specific_error(conform_password_div , msg)
          display_red_border ( conform_password_input_element)
          return false ;
     }
}

function store_jwt(value )
{
     localStorage.setItem (JWT_TOKEN , value ) 
     return ;
}

function divert_page  ( )
{
     window.location.replace ( product_landing_page)
}

//hard coding the username 
async function handle_data (  password )
{
     const username = sessionStorage.getItem("email")
     if( username == null )
          return; 
     
     let response  =  await send_data(username , password ) 

     console.log( response ) 

     if ( response.ok)
     {
          const json_data   = await response.json() ; 
          const jwt_token = json_data.jwt_token 
          store_jwt (  jwt_token)
          divert_page (  )            
     }
     else 
     {
          let msg = await  response.text() ; 
          alert( msg ) ;
     }
}

submit_btn.addEventListener(  'click' , (e) =>
{
     const password_value =  password_div.querySelector('input').value
     const conform_password_value = conform_password_div.querySelector('input').value
     if ( is_valid_password ( password_value)  && is_valid_confirm_password(password_value , conform_password_value))
     {
          handle_data( password_value ) 
     }

}
)