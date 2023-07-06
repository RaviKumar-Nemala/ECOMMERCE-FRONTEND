import { divert_page, get_jwt, has_jwt  ,UNAUTHORIZED ,  SESSION_EXPIRED_MSG , ERROR_MSG, BASE_URL } from "../FIRST/Utils.js"
import { send_request } from "../SEND_REQUESTS/request_sender.js"

let from_login_page =  false ; 

const LANDING_PAGE = '../index.html';

export class Payments {

     // #PAYMENT_REQUEST_URL = `${BASE_URL}/payments/request'
     #rzp =  null; 

     #PAYMENT_REQUEST_URL = `${BASE_URL}/payments/bulk_request`

     #PAYMENT_DETAILS_URL = `${BASE_URL}/payments/validate_payment_details`

     #PAYMENT_DETAILS_REMOVE_URL = `${BASE_URL}/payments/remove_payment_details`

     #RZP_PAYMENT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

     load_rzp_script( )
     {
          let ele = document.createElement('script')
          ele.setAttribute('src',this.#RZP_PAYMENT_SRC) ;
          ele.setAttribute("type", "text/javascript");
          document.head.appendChild(ele);
          ele.addEventListener('load',(e)=>
          {    
               this.#rzp =  new Razorpay();
          })
          
          // ele.onload  = ()=>{
          // document.querySelector('head').appendChild( ele ) ; 
          // console.log(document.querySelector('head'))
          // this.#rzp  = new Razorpay();
          // alert('loaded')
          // }
     }

     async #send_payment_details( details )
     {
          console.log ( details );

          const METHOD_TYPE = 'POST';

          if ( !has_jwt())
          {
               alert( 'PAYMENT FAILED PLEASE LOGIN TO YOUR AGAIN ');
               return;
          }          

          let jwt =  get_jwt();  
          
          let params = { 
               payment_id : details.razorpay_payment_id,
               order_id :  details.razorpay_order_id,
               signature :  details.razorpay_signature,
               jwt_token : jwt
          };

          let response = await  send_request(this.#PAYMENT_DETAILS_URL , params ,  METHOD_TYPE, jwt);

          if ( response.ok)
          {
               alert('order has placed successfully');
               return new Promise( ( resolve,reject)=>
               {
                   resolve("ORDER PLACED SUCCESSFULLY")
               }
               )
          }
          else 
          {
               alert('SOMETHING WENT WRONG PLEASE TRY AFTER SOME TIME')
               return new Promise((resolve, reject)=>
               {
                   reject("SOMETHING WENT WRONG WHILE PLACING ORDER");
               })
          }
     }
     async #remove_payment_details()
     {
          let jwt_token =  get_jwt();
          if( jwt_token == null )  return; 
          const method_type = 'DELETE';
          let resposne =  await  send_request( this.#PAYMENT_DETAILS_REMOVE_URL,{ jwt_token} ,method_type , jwt_token);
     }
     // if the user close the payment page 
     // check if it is requested from the  login page 
     // if it from the login page then  redirect page to  the home page
     static  handle_closed_payment_page()
     {
          let payments = new Payments();
          payments.#remove_payment_details();
          if( from_login_page == true )
          {
             window.location.assign(LANDING_PAGE);
          }
     }
     static hande_successful_payment( details)
     {
          let payments = new Payments();

          payments.#send_payment_details( details ).then( (msg)=>
          {
               if( from_login_page == true)
               { 
                    alert( msg ) ;
                    window.location.assign( LANDING_PAGE);
               }
          }
          ).catch( (msg)=>
          {
               alert( msg ) ; 
          })

     }

     #make_payment(details)
     {

          var options = {
               "key": "rzp_test_m4SNOy01AucT2E", // Enter the Key ID generated from the Dashboard
               "amount": details.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
               "currency": "INR",
               "name": "sample Ecommerce",
               "description": "Test Transaction",
               // "image": "https://example.com/your_logo",
               "order_id": details.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
               // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
               "prefill": {
                   "name": "", //your customer's name
                   "email": "", 
                   "contact": ""
               },
               "notes": {
                   "address": "Razorpay Corporate Office"
               },
               "theme": {
                   "color": "#3399cc"
               },
               "handler": async function (response){
                   
                    Payments.hande_successful_payment( response ) ;
               },
               "modal": {
                    "ondismiss": function(){
                         Payments.handle_closed_payment_page();
                    }
                }
           };
     
            let rzp = new Razorpay(options);

           rzp.on("payment.failed" , (response) =>
           {
               console.log(response.error.code );
               console.log (response.error.description);
               console.log( response.error.source);
               let payments = new Payments();
               payments.#remove_payment_details();
          })

               rzp.open();
     }
     async #send_payment_request(params) {
          const method_type = 'POST';

          let response = await send_request(this.#PAYMENT_REQUEST_URL, params, method_type, params[0].jwt_token);

          if (response.ok) {
               response = await response.json();
               console.log(response)
               this.#make_payment(response)
               return new String( "SUCCESS") ; 
          }
          return response;
     }
     async initialize_payment(jwt_token, product_uuid ,  quantity) {
          let params = [] ;
          let obj = 
          {
               jwt_token ,  product_uuid ,  quantity
          }
          params.push( obj ) ; 
          this.bulk_initialize_payment( params )
     }
     // called from the carts page
     // for sending the payment requst for the multiple products
     async bulk_initialize_payment(  params , source=false)
     {
          if( source == true )
          {
               from_login_page = true ;
          }
          else 
          {
               from_login_page = false;
          }

          //when the payment request  placed successfully then  the 
          // payment script is automatically executed 
          // if  not then need to show the error message
          // most propable error message is jwt_token expiration 
          // or server error 
          let response   = await  this.#send_payment_request( params ) ;     
               if ( response.status  ==  403)
          {
               return new Promise( (resolove, reject) => 
               {
                    return reject(SESSION_EXPIRED_MSG)
               }
               )
          }
          else if ( response.status == 400){
               return new  Promise ( (resolve , reject ) =>
               {
                    return reject ( ERROR_MSG)
               })
          }
     }
}