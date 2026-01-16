 
  var advance = function advance() {
    if(typeof quickAddButton == 'function'){
      quickAddButton();
    }
  }
  var infinitescroll = {
    scolljs: function(){
      var endlessScroll = new Ajaxinate({
        container: '#product-grid',
        pagination: '#AjaxinatePagination',
        loadingText: document.getElementById('AjaxinatePagination').dataset.text,
        callback: advance,
        //offset: 200
      });
    }
  }
  infinitescroll.scolljs();
  document.addEventListener('scroll', function(e) {
  	var totalpage = document.querySelector('#AjaxinatePagination a')?.dataset?.page ?? sessionStorage?.getItem('totalpage');
	sessionStorage.scrollPos = document.documentElement.scrollTop;
	sessionStorage.totalpage = totalpage;
  });
  if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) {
	var scrollTop=sessionStorage?.getItem('scrollPos')
	document.documentElement.scrollTop = scrollTop ??  document.body.scrollTop;
    window.scrollTo(0,0);
	scrollManualy(scrollTop);
	function scrollManualy(scrollTop){
		scrollTop = parseInt(scrollTop);
		window.scrollTo(0,scrollTop)
 		setTimeout(function(){
			if(window.scrollY < scrollTop){
				scrollManualy(scrollTop)
			}
		},1000);
	 }
  }