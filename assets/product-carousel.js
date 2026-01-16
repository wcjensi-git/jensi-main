function productcarousel(){
  var productslider=[];
  document.querySelectorAll('.product-carousel').forEach(function(Element,index){
    let productid = Element.dataset.id;
    let outer_carousel = Element.closest('.carousel-rowouter');
    let nextbutton = outer_carousel.querySelectorAll('.swiper-button-next')[0];
    let prevbutton = outer_carousel.querySelectorAll('.swiper-button-prev')[0];
    let swiperObject={
      loop:eval(Element.dataset.loop),
      slidesPerView: "auto",
      navigation: {
        nextEl:nextbutton,
        prevEl:prevbutton,
      },
    };    
    productslider[productid]=new Swiper(Element,swiperObject);
  });
}
productcarousel();