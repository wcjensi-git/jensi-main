class VariantRadios extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);    
  }
  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    if (!this.currentVariant){
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    }else {
      this.updateMedia();
      this.updateVariantInput();
      this.updateURL();
      this.renderProductInfo();
    }
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }
  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;
    var fetured_id = this.currentVariant.featured_media.id;
    if(document.querySelector('.media-thumb')){
      document.querySelectorAll('.media-thumb .media-grid-column').forEach(function(e){
        var mediaid = e.dataset.id;
        if(mediaid==fetured_id){
          new Swiper('.media-nav').slideTo(e.dataset.index,1000,false);
        }
      });
    }
  }
  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }
  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('.option-wrap'));
    const fieldlen = fieldsets.length;
    let option_count = 0;
    fieldsets.forEach(function(eachfield){
      var checked_gender = eachfield.querySelector('input:checked');
      if(checked_gender){
        option_count++;
      }
    });
    this.options = fieldsets.map((fieldset) => {
      if(option_count>=fieldlen){
        return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
      }
    });
    if(option_count>=fieldlen){
      document.querySelector('.choose-cart').classList.remove('hide-selectore-button');
      document.querySelector('.choose-selector').classList.add('hide-selectore-button');      
    }else{
      document.querySelector('.choose-cart').classList.add('hide-selectore-button');
      document.querySelector('.choose-selector').classList.remove('hide-selectore-button');
    }   
  }
  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
    .then((response) => response.text())
    .then((responseText) => {
      const id = `price-${this.dataset.section}`;
      const html = new DOMParser().parseFromString(responseText, 'text/html')
      const destination = document.getElementById(id);
      const source = html.getElementById(id);
      if (source && destination) destination.innerHTML = source.innerHTML;
      if(this.currentVariant){
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      }
    });
  }
  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;
    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }
    if (!modifyClass) return;
  }
  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
  }
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}
customElements.define('variant-radios', VariantRadios);
function variant_drodown(){
  if(document.querySelector('.dropdown-wrap')){
    document.querySelectorAll('.dropdown-wrap').forEach(function(dropdown){
      dropdown.querySelector('.variant-dropdown').addEventListener('click',function(event){
        event.preventDefault();
        dropdown.classList.toggle('active');
        dropdown.querySelectorAll('input[type="radio"]').forEach(function(e){
          e.addEventListener('change',function(button){
            dropdown.classList.remove('active');
            dropdown.querySelector('.variant-dropdown').innerHTML = button.path[0].value;
          });
        });
      });
    });
  }
}
document.querySelector('.product-addcart').addEventListener('click',function(evt){
  evt.preventDefault();
  const config = fetchConfig('javascript');
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  delete config.headers['Content-Type'];
  var cartform = document.querySelector('.product-addcart').closest('form');
  const formData = new FormData(cartform);  
  config.body = formData;
  fetch(`${routes.cart_add_url}`, config)
  .then((response) => response.json())
  .then((response) => {
    if (response.status) {
      document.querySelector('.product-form-error').innerHTML = response.description;
      setTimeout(function(e){
        document.querySelector('.product-form-error').innerHTML  = '';
      },2000);
      return;
    }else{
      if(typeof load_cart == 'function'){
        load_cart();
        setTimeout(function(e){
          document.querySelector('body').classList.add('open-drawer');
        },500);
      }else{
        window.location.href = "/cart";
      }
    }
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {

  });
});
function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}
function product_slider(){
  if(document.querySelector('.media-slider')){
    var swiper = new Swiper(".media-thumb", {
      loop: false,
      spaceBetween: 0,
      slidesPerView: 'auto'
    });
    var swiper2 = new Swiper(".media-nav", {
      loop: true,
      spaceBetween: 0,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
      thumbs: {
        swiper: swiper,
      },
    });
  }
}
product_slider();
variant_drodown();
document.addEventListener("shopify:section:load", function(event) {
  product_slider();
  variant_drodown();
});

function getElementY(query) {
  return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top
}
function doScrolling(element, duration) {
	var startingY = window.pageYOffset
  var elementY = getElementY(element)
  var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
	var diff = targetY - startingY
  var easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }
  var start
  if (!diff) return
	window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp
    var time = timestamp - start
    var percent = Math.min(time / duration, 1)
    percent = easing(percent)
    window.scrollTo(0, startingY + diff * percent)
    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}
if(document.querySelector('.choose-selector')){
  if (window.innerWidth < 641) {
    document.querySelector('.choose-selector a').addEventListener('click', doScrolling.bind(null, '#product-form-installment', 2000))
  }
}