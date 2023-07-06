const watches_container =  document.getElementById('watches_container')

const shoes_container = document.getElementById('shoes_container')

const phones_container = document.getElementById('phones_container') 

const laptops_container = document.getElementById('laptops_container')

const shirts_container = document.getElementById('shirts_container')

export class Front_Pg_View
{   
     
     #get_product ( product_name , price , product_uuid , category_name )
     {

          if ( product_name.length > 35 )
          {
               product_name = product_name.substr(0, 35) ;
               product_name += '...';
          }

          console.log( product_name ,  price , product_uuid)
          
          let li = `<li class="product_item" data-category_name = ${category_name} >
          <img src=${product_uuid}>
          <p class="product_name">${product_name}</p>
          <div class="rating">
               <i class="fa-sharp fa-solid fa-star" id="active"></i>
               <i class="fa-sharp fa-solid fa-star" id="active"></i>
               <i class="fa-sharp fa-solid fa-star" id="active"></i>
               <i class="fa-sharp fa-solid fa-star" id="active"></i>
               <i class="fa-sharp fa-solid fa-star"></i>
          </div>
          <p class="product_price">Rs.${price}</p>
     </li>`

          return li;
     }
     
     render_shoes_data( data )
     {
          if ( data== null)
               return ;
          
          if( data.length > 15)
          {
               data = data.slice( 0 , 15);     
          }
     
          let ul = shoes_container.querySelector('ul');

          let html = '';

          for( let curr_item of data )
          {
               let { product_name , price, product_uuid , category_name} =  curr_item ; 

               const li = this.#get_product( product_name ,price,  product_uuid , category_name );
               
               html += li;
               
          }
          ul.innerHTML = html;

     }

     render_laptops_data( data)
     {
          if ( data== null)
               return ;
          
          let ul = laptops_container.querySelector('ul');

          let html = '';


          if( data.length > 15)
          {
               data = data.slice( 0 , 15);     
          }

          for( let curr_item of data )
          {
               let { product_name , price, product_uuid , category_name} =  curr_item ; 

               const li = this.#get_product( product_name ,price,  product_uuid , category_name );
               
               html += li;
               
          }
          ul.innerHTML = html;

          
     }




     render_phones_data( data )
     {
          if ( data== null)
               return ;
          
          let ul = phones_container.querySelector('ul');

          let html = '';

          if( data.length > 15)
          {
               data = data.slice( 0 , 15);     
          }

          for( let curr_item of data )
          {
               let { product_name , price, product_uuid , category_name} =  curr_item ; 

               const li = this.#get_product( product_name ,price,  product_uuid , category_name );
               
               html += li;
               
          }
          ul.innerHTML = html;

     }

     render_watches_data(data)
     {
          if ( data== null)
          return ;
     
     let ul = watches_container.querySelector('ul');

     let html = '';

     if( data.length > 15)
     {
          data = data.slice( 0 , 15);     
     }

     for( let curr_item of data )
     {
          let { product_name , price, product_uuid , category_name} =  curr_item ; 

          const li = this.#get_product( product_name ,price,  product_uuid , category_name );
          
          html += li;
          
     }
     ul.innerHTML = html;

     }

     render_shirts_data(data)
     {
          if ( data== null)
          return ;
     
          if( data.length > 15)
          {
               data = data.slice( 0 , 15);     
          }

     let ul = shirts_container.querySelector('ul');

     let html = '';

     for( let curr_item of data )
     {
          let { product_name , price, product_uuid , category_name} =  curr_item ; 

          const li = this.#get_product( product_name ,price,  product_uuid , category_name );
          
          html += li;
          
     }
     ul.innerHTML = html;

     }
}