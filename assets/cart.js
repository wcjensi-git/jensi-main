var quanity_box = document.querySelectorAll('.quantity-box');
var update_button = document.querySelector('.button-update');
if(quanity_box){
  quanity_box.forEach(function(quantitywrap){
    var quantity_minus = quantitywrap.querySelector(".quantity-minus");
    var quantity_add = quantitywrap.querySelector(".quantity-plus");
    var quantity = quantitywrap.querySelector(".quantity-input input");
    const minimum = 0;
    if(quantity_minus){
      quantity_minus.addEventListener("click", function(){
        if (quantity.value <= minimum) {
          quantity_minus.disabled = true;
          return;
        } else {
          quantity_minus.disabled = false;
        }
        quantity.value--;
        if(update_button){
          update_button.click();
        }
      });
    }
    if(quantity_add){
      quantity_add.addEventListener("click", function() {
        if (quantity.value > minimum) {
          quantity_minus.disabled = false;
        }
        quantity.value++;
        if(update_button){
          update_button.click();
        }
      });
    }
  });
}