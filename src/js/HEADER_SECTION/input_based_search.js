import { send_request } from "../SEND_REQUESTS/request_sender.js";
import { reload_page , BASE_URL } from "../FIRST/Utils.js";

const  search_bar_div = document.querySelector('.search_wrapper')
const product_page = '../FIRST/products_list.html'
const auto_captions_container = search_bar_div.querySelector('.auto_captions_container')
const auto_captions_list =  auto_captions_container.querySelector('.auto_captions_list')
const  search_based_data_retival_url =  `${BASE_URL}/input/get_data`

let brand_based_suggestions =  null , category_based_suggestions =  null , brand_category_data = null;

export  async function send_data (  _keywords )
{
     const method_type  = 'POST'
     let params = {
          keywords :  _keywords
     }
     let response =  await send_request( search_based_data_retival_url , params , method_type )
     if( response.ok )
     {
          let json_response = await  response.json () 
          return json_response;
     }    
     else 
     {
          alert('NO DATA FOUND WITH THE GIVEN INPUT')
          return Promise.reject("NO DATA FOUND WITH THE GIVEN INPUT")
     }
}

export function store_brand_category_names ( data )
{

     // alert('logging')
     console.log ( data )

    // let data = JSON.parse( localStorage.getItem("auto_suggestions_data"))

     brand_category_data =   data ;

     let category_data = data.categories;

     let brand_data  = data.brands 

     console.table ( [category_data ,  brand_data] )
      
     category_based_suggestions =  new Map()

     brand_based_suggestions = new Map () 

     for ( let key in  category_data )
     {
          let category_name = key

          let suggestions =  category_data [ category_name ]

          category_based_suggestions.set(category_name , suggestions)

     }

     for ( let key in  brand_data )
     {
          let brand_name = key 

          let suggestions =  brand_data [ brand_name]

          brand_based_suggestions.set( brand_name ,  suggestions )
     }
    // console.table ( [brand_based_suggestions ,  category_based_suggestions ]) 

}

function add_listeners () 
 {
     // alert('called')     
     let suggestion_nodes  = auto_captions_list.childNodes
     console.log(suggestion_nodes)
     if ( suggestion_nodes.length ==  0 )
          return ; 

     suggestion_nodes.forEach ( ele => 
          {
               console.log ( ele  , ele.className ,ele.id ) ;

               ele.addEventListener( 'click' ,  (e) =>
               {
                    // console.log ( 'clicked  suggestions list = ' ,  e.target)
                    let clicked_suggestion_id =  e.target.id ;
                    let clicked_suggestion_classnam  =e.target.className ;
                    let data =  e.target.textContent;
                    // console.clear()
                    console.log( data ) 
                    data = validate_input( data)
                    if ( data != null )
                    {
                         console.log( data)
                    }
               
                    reload_page(product_page , { input :  data})

               } )
          })     
 }


function display_suggestions( suggestions){

     let html = ''
     console.log( suggestions )

     let idx = 0 ; 

     for ( let value of suggestions )
     {

          console.log (value)
          html += `<li class = suggestion_item  id = suggestion_${idx}>${value}</li>`
          idx++;
     }

     auto_captions_list.innerHTML = html;
     add_listeners ( ) ; 
}

function fill_auto_suggestions( entered_data ) 
{
     
     if ( entered_data == null ||entered_data == '' ||  entered_data == ' ')
     {
          auto_captions_container.classList.add('disable')
          return;
     }
   
   entered_data = new String(entered_data.trim().toLowerCase());
     //console.log( entered_data )
     let matched_suggestions = []

     brand_based_suggestions.forEach( (category_name  , brand_name) =>
     {
          if ( brand_name.indexOf(entered_data )  != -1 || entered_data.indexOf(brand_name) != -1)
          {
               let suggestions =  brand_name + " " + category_name ;

               matched_suggestions.push(suggestions)  

               console.log('brand' , brand_name)        
          }

     })

     category_based_suggestions.forEach( ( suggestions , category_name ) =>
     {
          if ( category_name.indexOf( entered_data ) != -1 || entered_data.indexOf( category_name) != -1)
          {
               console.log ('category' , category_name)

                matched_suggestions =  matched_suggestions.concat(suggestions)
          }

     })

     console.log ( matched_suggestions )

     if ( matched_suggestions.length > 0 )
     {
          auto_captions_container.classList.remove('disable')
          
          display_suggestions( matched_suggestions )
     }
     else
     {
          //alert('found')
         auto_captions_container.classList.add('disable')
     }
     return ;
}


function validate_input(entered_input){

     if ( entered_input =='')
     {
          return null
     }

    // alert( typeof entered_input)

     entered_input = entered_input.trim().split(' ')

     let entered_key_words = entered_input.filter((ele)=>
     {
          if (ele != '' && ele != ' ')
          {
               return true;
          }
          else 
          {
               return false;
          }
     }).map( (ele) => ele.match(",")? ele.replace(",",''):ele )

     console.log ( entered_key_words )

     return entered_key_words;

}

function get_user_input( e )
{
     let entered_data =  e.target.value
     entered_data = entered_data.trim()
     // console.log ( entered_data )
     if ( e.keyCode==  13 )
     {
          console.log ( e.target)

        let res = validate_input( entered_data )

     return res.length==0?null:res;
     }     
     else
     {
          fill_auto_suggestions ( entered_data )
     }
}

function activate_search_bar()
{
search_bar_div.querySelector('.user_input').addEventListener('keyup' , (e) => {

          let res = get_user_input(e)
          if ( res == null)
          {
               return;
          }
          console.log( res )
         // alert( res )
          reload_page(product_page , { input :  res })
}

)

}


activate_search_bar()
