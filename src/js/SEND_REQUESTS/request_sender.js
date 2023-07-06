export const send_request = async function _request(url, params, method = 'GET' , jwt_token = null) {
     
     let options =
     {
          method,
          mode: 'cors',
     }
     if ( jwt_token != null )
     {
          options.headers =
          {
               'Content-type': 'application/json',
               'Authorization' : 'Bearer '+jwt_token
          }
     }
     else 
     {
          options.headers = 
          {
               'Content-type': 'application/json',
          }
     }
     if (method === 'GET' && params != null) {
          url += '?' + (new URLSearchParams(params)).toString();
     }
     else if (method === 'POST'  || method == 'DELETE' || method == 'PUT') {
          options.method = method;
          options.body = JSON.stringify(params);
     }
     let response = await fetch(url, options)
     return response;
}