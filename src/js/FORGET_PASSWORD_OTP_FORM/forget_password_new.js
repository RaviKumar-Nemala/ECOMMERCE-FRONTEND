import { send_otp_to_server , send_resend_notification ,  check_for_expiration } from './forget_password_new_data_sender.js';
let time_val_div = document.querySelector('.time_displayer .time_val');
const password_update_page =  '../FORGET_PASSWORD_UPDATION_FORM/forget_passwd_update.html'
let error_msg = document.querySelector('.error_msg')
let inputs =  document.querySelectorAll('.otp_code input')
let button = document.querySelector('.verify_btn')
let resend_btn =  document.querySelector( '.resend_btn')
let otp_container = document.querySelector('.otp_container')
let time_displayer =  document.querySelector('.time_displayer')
var timer = null; 

window.addEventListener('load' , (e)=>
{    
      if( !sessionStorage.getItem("email"))
      {
          close_current_page("Something went wrong. Please try again later.")
           return;
      }     
      check_otp_expiration_time();

      handle_expiration_timer();
     
     otp_container.classList.remove('hide');

     handle_timer(60)
}
)

inputs.forEach((curr_item) =>
{
     
     let prev_item = curr_item.previousElementSibling;
     let next_item  = curr_item.nextElementSibling
     curr_item.addEventListener('focus' , ( evnt ) =>
     {
               if ( prev_item && prev_item.value ==='')
               {
                    prev_item.focus()
               }
     }
     )

     curr_item.addEventListener('keyup', (evnt) =>
     {
     let regx = new RegExp(/[0-9]/)
     if ( regx.test( curr_item.value) == false )
     {
          curr_item.value = "";
     }
     //if the user entered the backspace on the input
     if (evnt.keyCode === 8)
     {
               if ( curr_item.value == '' && prev_item)
               {
                    prev_item.focus()
                    
               }
     }
     else if ( curr_item.value !== '' && next_item )
     {
          next_item.focus()
     }    


let btn_flag = true;
inputs.forEach( (input) =>
{
     if( input.value === '')
     {
          btn_flag = false; 
     }    
})
if ( btn_flag )
{
     button.classList.add('active');
}
else 
{
          button.classList.remove('active')
}
}
)
}
)

function clear_input( )
{
     inputs.forEach((ele)=>
     {
          ele.value = "";
     })
}

function get_otp_value (  )
{
     let otp = 0;

         inputs.forEach((input) =>
     {
          console.log ( input.value)

          otp = otp * 10 + parseInt( input.value)
     }
     )
   console.log ( 'entered otp value ' ,  otp ) 
   return  otp;
}

function  divert_page () 
{
     window.location.replace( password_update_page )
}

function display_error_message( MSG )
{
     error_msg.classList.remove( 'hide');
     error_msg.textContent = MSG;
     window.setTimeout( ()=>
     {
          error_msg.classList.add('hide')
     }  , 2*1000);
}
// takes the response  checks if the no of attemps are reached to the max attempts
// in that case it simple stops sending the requests and block the page
//otherwise it simply do the same flow
async function handle_response ( response){

     let json_response =  await response.json()

     const remaining_attempts = json_response.remaining_attempts

     if ( remaining_attempts <= 0 )
     {
          let err_msg= "OTP validation limit has been reached. Please try again later.";
          close_current_page(err_msg);
     }
     else 
     {
          display_error_message("Invalid Otp Value")
          clear_input();
     }
}
// stores the jwt token in the local storage 
function store_jwt ( jwt_data)
{
     localStorage.setItem("jwt_token" ,  jwt_data)
}

async function handle_data(   otp_val , username)
{
     let response = await send_otp_to_server( otp_val , username)
     if ( response.ok)
     {
          sessionStorage.setItem("email",username)
          divert_page ();
     }
     else 
     {
          handle_response( response)     
     }
}

function get_username( )
{
     let user_name = sessionStorage.getItem("email")
     return user_name;
}

button.addEventListener('click' , (e)=>
{
     if( button.classList.contains('active'))
     {
          const otp_val =   get_otp_value (   )
          const username =  get_username()
          handle_data( otp_val  , username )
     }
}
)
function activate_resend_button ()
{
     resend_btn.enabled = true 
     resend_btn.setAttribute("style" ,  "color : white;cursor:pointer")
}

// if the user clicked on the resend button then we send the request to the backend
//until we get the response from the backend we simply disable the resend button 
function disable_resend_button()
{
     resend_btn.setAttribute("style" , "color:black;cursor:none")
     resend_btn.enabled = false
}

//before closing the otp page make sure username will be removed from the session storage
// so even when the user refreshes the page again  the username won't be available in 
// the session
//when the username is not available in the session then the onload event will not display the otp form again
function close_current_page(MSG)
{
     sessionStorage.removeItem("email");
     let html =  `<h1>${MSG}</h1>`;
     document.querySelector('body').innerHTML = html ;
}

resend_btn.addEventListener('click' , (e) =>
{
     if ( resend_btn.enabled){
     clearTimeout(timer)     
     let username = sessionStorage.getItem("email")
     disable_resend_button() 
     send_resend_notification(username).then((response) =>
     {
          console.log( response);   
          if ( response.ok )
          {
               handle_timer(  60  );
          }
          else 
          {
               close_current_page("MAXIMUM OTP RESEND ATTEMPTS ARE REACHED PLEASE TRY AFTER SOMETIME")
          }
     }
     )
}
})

 function change_time_val ( seconds )
{         

     console.log ( seconds )
     let remaining_time  = seconds;

     console.log ('remaining_time',  remaining_time)

     time_val_div.innerText = `${remaining_time} seconds`;
}

function handle_timer(  seconds )
{    
          if ( seconds < 0 )
          {
               clearTimeout (timer)
               activate_resend_button();
               return ;     
          }

          change_time_val( seconds)

          seconds -- 

          timer = setTimeout ( () =>{
               handle_timer(  seconds )
           } ,1000) 
}

function close_otp_container () 
{
     document.querySelector('.otp_container').style.display  = 'none'
}

function handle_expiration_timer()
{
window.setInterval(()=>
     {    
          check_otp_expiration_time();
     } , 1000*60)
}

// the default validation time for otp is 5 minutes
//it sends the request to our backend for every 1minute to check weather the otp validation time has expired or not
//if the otp validation time has expired then we simply  display the  appropriate 
// message and close the page
async function check_otp_expiration_time()
{    
     const username = sessionStorage.getItem("email");

     check_for_expiration(username).then( ()=>
     {

     })
     .catch( (msg)=>
     {
          close_current_page( "SOMETHING WENT WRONG PLEASE TRY AGAIN LATER") ; 
     })    
}