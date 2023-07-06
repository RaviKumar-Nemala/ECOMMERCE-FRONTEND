import { send_request } from '../SEND_REQUESTS/request_sender.js'
import { send_otp_to_server, send_resend_notification  , check_for_expiration} from "./otp_data_sender.js";
import { Payments } from '../PAYMENTS/payments.js';


let payments = null; 

let otp_expiration_handler = null;

let time_val_div = document.querySelector('.time_displayer .time_val');

const landing_page_url =  '../index.html'

let error_msg = document.querySelector('.error_msg')

let inputs =  document.querySelectorAll('.otp_code input')

let button = document.querySelector('.verify_btn')

let resend_btn =  document.querySelector( '.resend_btn')

let otp_container = document.querySelector('.otp_container')

let time_displayer =  document.querySelector('.time_displayer')

var timer = null; 

function  has_payment_request_params (  )
{
     let url = new URL( window.location ) ;
     
     let data =  url.searchParams.get( 'make_payment');

     if( data != null )
     {
          return JSON.parse( data ); 
     }    
     return data;
}

window.addEventListener('load' , (e)=>
{    
     if( !sessionStorage.getItem("email"))
     {
          close_current_page("Something went wrong. Please try again later.")
          return;
     }

     // confirm('THIS FORM AUTOMATICALLY CLOSES AFTER 5 MINUTES')
     
     payments = new Payments();

     payments.load_rzp_script() ;

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
     window.location.replace( landing_page_url)
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

function handle_payments( data , jwt_token )
{
    data.forEach((curr_obj)=>
          {
               curr_obj.jwt_token = jwt_token ;
          })   
     const from_login = true; 
     payments.bulk_initialize_payment( data , from_login);

}


async function handle_data(   otp_val , details)
{
     let response = await send_otp_to_server( otp_val ,details)

     if ( response.ok)
     {    

          let jwt_data =  await response.json()
          const jwt_token =  jwt_data.jwt_token
          console.log( jwt_token)
          store_jwt( jwt_token)
          clear_expiration_timer();
          let res =  has_payment_request_params() ;

          if ( res == null )  
               divert_page ();
          else 
          {
               handle_payments( res ,  jwt_token );
          }
     }
     else 
     {
          handle_response( response)     
     }
}

function get_userdetais( )
{
     let user_name = sessionStorage.getItem("email")
     let password = sessionStorage.getItem("password")
     let nick_name = sessionStorage.getItem("nick_name");
     let details = { user_name , password , nick_name};
     return details ;

}

button.addEventListener('click' , (e)=>
{
     
     if( button.classList.contains('active'))
     {
          const otp_val =   get_otp_value (   )

          const details =  get_userdetais();

          handle_data( otp_val  , details )
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

// hard coding the username ( email ) cause we don't have another email inorder to verify the otp 
resend_btn.addEventListener('click' , (e) =>
{
     // the resend button enabled after the timeout.

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

function  block_entered_input_values () 
 {
          inputs.forEach ( ( input) =>
          {
               console.log ( input.value)    

               input.value = ''

          })
}

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


function clear_expiration_timer()
{
     if ( otp_expiration_handler == null )   return; 

     window.clearInterval(otp_expiration_handler);

}

function handle_expiration_timer()
{
     if( otp_expiration_handler == null){
          window.setInterval(()=>
     {
          check_otp_expiration_time();
     } , 1000*60)
  }

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