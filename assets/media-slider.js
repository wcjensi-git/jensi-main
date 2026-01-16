function mediaslider(){
  var mediaslider=[];
  document.querySelectorAll('.media-slider').forEach(function(Element,index){
    var mediaid = Element.dataset.id;
    var media_autoplay = Element.dataset.autoplay;
    let swiperObject={
      loop:true,
      simulateTouch: eval(Element.dataset.draggable),
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    };
    if(eval(media_autoplay)==true){
      swiperObject.autoplay={
        delay: eval(Element.dataset.playtime)
      }
    }
    mediaslider[mediaid]=new Swiper(Element,swiperObject );
  });
}
mediaslider();