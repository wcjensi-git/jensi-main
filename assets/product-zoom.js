function onZoom(e,zoomClass){
  const x = e.clientX;
    const y = e.clientY;
    zoomClass.style.transformOrigin = `${x}px ${y}px`;
    zoomClass.style.transform = "scale(2.2)";
}
function offZoom(e,zoomClass){
  zoomClass.style.transformOrigin = `center center`;
  zoomClass.style.transform = "scale(1)";
}
document.querySelectorAll(".product-image-zoom").forEach(function(zoomClass){
  zoomClass.addEventListener('click',function(e,ie){
    let index = [...e.target.closest(".medialist").children].indexOf(e.target.closest(".media-grid-column"));
    document.querySelectorAll(".media-grid-column").forEach(function(mediaGrid,i){
      if(i != index){
        mediaGrid.classList.remove('active');
        var sibling_Class = mediaGrid.querySelector('.product-image-zoom');
        if(sibling_Class){
          offZoom(e,sibling_Class);
        }
      }
    });
    zoomClass.closest('.media-grid-column').classList.toggle('active');
    if(zoomClass.closest('.media-grid-column').classList.contains('active')){
      onZoom(e,zoomClass);
    }else{
      offZoom(e,zoomClass);
    }
  });
  zoomClass.addEventListener('mouseleave',function(e){
    offZoom(e,zoomClass);
    zoomClass.closest('.media-grid-column').classList.remove('active');
  });
  zoomClass.addEventListener('mousemove',function(e){
    let active_zoom = document.querySelector('.media-grid-column.active .product-image-zoom');
    if(active_zoom){
    onZoom(e,active_zoom);
    }
  });
});