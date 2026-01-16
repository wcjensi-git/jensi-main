function load_cart(){
  fetch(window.Shopify.routes.root +'?section_id=cart-drawer')
  .then((response) => response.text())
  .then((responseText) => {
    const cartid = 'cart-drawer';
    const html = new DOMParser().parseFromString(responseText, 'text/html')  
    const destination = document.querySelector('.cart-sidebar');
    const source = html.getElementById(cartid);
    if (source && destination) destination.innerHTML = source.innerHTML;
    document.querySelectorAll('.item-remove').forEach(function(cartRemove){
      var data_line = cartRemove.dataset.line;      
      cartRemove.addEventListener('click',(evt) => removeItem(data_line));
    });
    document.querySelectorAll('.header-cart').forEach(function(cartButton){
      cartButton.addEventListener('click',function(e){
        document.querySelector('body').classList.add('open-drawer');
        document.querySelector('body').classList.remove('open-menu','open-search','open-sort','open-filter');
      });
    });
    document.querySelectorAll('.overlay-box,.cart-drawer-close').forEach(function(cartButton){
      cartButton.addEventListener('click',function(e){
        document.querySelector('body').classList.remove('open-drawer','open-menu','open-search','open-sort','open-filter');
      });
    });
    const url = '/cart.js';
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
      var cart_count = data.item_count;
      if(cart_count>0){
      	document.querySelector('.cart-count').innerHTML = cart_count;
      }else{
      	document.querySelector('.cart-count').innerHTML = '';
      }
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}
load_cart();
function removeItem(data_line){
  const data = {'line': data_line ,'quantity': 0 };
  fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => {
    load_cart();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
