import { send_data_to_server } from "./user_data_sender";
let credentials =  [];

let names = [] ;

function check_password_strength(password) {

     if (password.length <= 4) {
          alert('weak password')
     }

}

function display_green_border(element) {
     element.setAttribute("style", "border : 3px solid green")
}

function display_red_border(element) {
     element.setAttribute("style", "border : 3px solid red")
}

function display_red_text(element) {
     element.setAttribute("style", "color:red")

}

function display_green_text(element) {
     element.setAttribute("style", "color:green")

     return;

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
function verify_password(password_element) {

     const password_value = password_element.value

     console.log(password_value)

     const password_regx = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,20})");

     if (password_value.match(password_regx)) {
          console.log('success password_value')
          return true;
     }
     else {

          console.log('wrong password')

          display_red_border(password_element);

               if (password_value.length < 6) {
                    alert('password should contain 6 letters')
               }

               if (has_white_spaces(password_value)) {
                    alert('password does not contain white spaces')
               }
               if (!has_small_letters(password_value))
                    alert('password contain atleast one lower case letter')

               if (!has_capital_letters(password_value)) {
                    alert('password contain at least one uppercase letter')
               }

               if (!has_special_characters(password_value)) {
                    alert('password contain special character')
               }

               if (!has_numbers(password_value)) {
                    alert('password contain atlast one number')
               }

          
          return false;
          }
}

function verify_email(email_element, alerts) {

     let email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


     var email_correction_result = email_pattern.test(email)

     if (email_correction_result) {

          console.log('valid email ')

          return true;

     }
     else {
          
     }

}

function display_user_alerts(username_value) {

     console.log('inside of the user_alerts')
     console.log(username_value)
     if (username_value.length == 0) {
          alert('username should not be null')
     }

     if (username_value.length < 5) {
          alert('username should be greater then the 5')
     }
     if (has_white_spaces(username_value)) {

          alert('username does not contain  white spaces')
     }

}
function verify_userName(user_element, alerts) {

     let username_value = user_element.value

     console.log(username_value)

     const user_name_regx = /^[a-zA-Z0-9]+$/

     if (user_name_regx.test(username_value) && username_value.length > 5 && !has_white_spaces(username_value)) {
          display_green_border(user_element)

          console.log('valid user name ')

          credentials[0] = username_value

          return true;

     }
     else {

          display_red_border(user_element)

          console.log('invalid user name')

          if (alerts) {

               console.log('alerts on ')

               display_user_alerts(username_value)

          }

          return false; 
     }

}

export function store_names ( firstname , lastname)
{

     console.log('printing the names : ')

     names [ 0 ] = firstname ;

     names [ 1 ] = lastname;

     console.log ( firstname , lastname ) ;

}


function validate_input() {
     
     const user_element = document.querySelector('#user_name')

     let user_name_status = false; 
     let email_status = false;
     let password_status = false ;

     user_name_status   = verify_userName(user_element, true)

     const email = document.querySelector('#email')

     email_status = verify_email(email, true)

     let password_element = document.querySelector('#password')

     password_status = verify_password(password_element)

     if ( user_name_status  && email_status && password_status )
     {
          console.log('everything is ok')
     
          console.log ( credentials )

          names[0]  = localStorage.getItem("firstname")

          names [ 1 ] =  localStorage.getItem("lastname")
          
          console.log ( names ) ;

          send_data( names , credentials )

          //get_user_details();
     }
}    

function usernamekeyup() {

     let user_element = document.querySelector('#user_name')

     console.log(user_name)

     verify_userName(user_element, false)

}
function emailkeyup() {
     let email_element = document.querySelector('#email')

     verify_email(email_element, false)
}

function passwordkeyup() {
     let password_element = document.querySelector('#password')

     verify_password(password_element, false);

}


let user_name_element  = document.querySelector('#user_name');

if ( user_name_element)
user_name_element.addEventListener('mouseleave' ,usernamekeyup);

let email_element =  document.querySelector('#email');
if (email_element)
email_element.addEventListener('mouseleave' ,  emailkeyup);

let password_element = document.querySelector('#password')

if ( password_element)
password_element.addEventListener('mouseleave' ,passwordkeyup);

let submit_button = document.querySelector('#submit');
if ( submit_button )
submit_button.addEventListener('click' , validate_input );
