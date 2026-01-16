var login_form = document.querySelector('.login-form');
var recover_form =  document.querySelector('.recover-form');
if(login_form &&  recover_form){
  document.querySelector('.enable-login').addEventListener('click',function(e){
    e.preventDefault();
    login_form.classList.remove('hide-form');
    recover_form.classList.add('hide-form');
  });
  document.querySelector('.enable-forgot').addEventListener('click',function(e){
    e.preventDefault();
    login_form.classList.add('hide-form');
    recover_form.classList.remove('hide-form');
  });
}
document.querySelectorAll('.edit-address-button').forEach(function(editbutton){
  editbutton.addEventListener('click',function(e){
    e.preventDefault();
    var address_id = this.dataset.addressid;
    document.querySelectorAll('.address-edit-form').forEach(function(editformdiv){
      if(editformdiv.classList.contains('active-form') && editformdiv.dataset.id != address_id){
        editformdiv.classList.remove('active-form');
      }
    });
    document.querySelector('[data-id="'+address_id+'"]').classList.toggle('active-form');
  });
});
if(document.querySelector('#AddressCountryNew')){
  new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
    hideElement: 'AddressProvinceContainerNew'
  });
  document.querySelectorAll('[data-address-country-select]').forEach((select) => {
    const formId = select.dataset.formId;
    new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
      hideElement: `AddressProvinceContainer_${formId}`
    });
  });
}
document.querySelectorAll('.destroy_button').forEach(function(destroyButton){
  destroyButton.addEventListener('click',function(e){
    var destroyId = this.dataset.destroy;
    console.log(destroyId);
    Shopify.postLink(
      '/account/addresses/'+destroyId, 
      {'parameters': {'_method': 'delete'}}
    );
  });
});
if(document.querySelector('.account-link')){
  document.querySelector('.account-link').addEventListener('click',function(e){
    document.querySelector('.account-page-active').classList.add('active');
    document.querySelector('.account-left').style.display = 'none';
  });
}
if(document.querySelector('.add-address')){
  document.querySelector('.add-address').addEventListener('click',function(e){
    document.getElementById('address_form_new').classList.toggle('active-open-form');
  });
}