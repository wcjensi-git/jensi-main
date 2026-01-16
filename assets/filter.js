class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
      document.querySelector('body').classList.remove('open-filter','open-sort');
      typeof infinitescroll == 'object' && typeof infinitescroll?.scolljs == 'function' && infinitescroll?.scolljs()
    }, 500);
      //this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
      const applyfilter = this.querySelector('.apply-filter');
      if (applyfilter) applyfilter.addEventListener('click', this.debouncedOnSubmit.bind(this));    
      const filterbtn = this.querySelector('.filter-button');
      const sortbtn = this.querySelector('.sort-button');
      if (filterbtn) filterbtn.addEventListener('click',function(e){
      document.querySelector('body').classList.toggle('open-filter');
      document.querySelector('body').classList.remove('open-sort','open-drawer','open-menu','open-search');
    });    
      if (sortbtn) sortbtn.addEventListener('click',function(e){
      document.querySelector('body').classList.toggle('open-sort');
      document.querySelector('body').classList.remove('open-filter','open-drawer','open-menu','open-search');
    });
      if(document.querySelector('.sort-box')){
      this.querySelector('.sort-box').addEventListener('input', this.debouncedOnSubmit.bind(this));
    }
    }
  static setListeners() {
      const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    }
    window.addEventListener('popstate', onHistoryChange);
  }
  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;
      FacetFiltersForm.filterData.some(filterDataUrl) ?
        FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) :
      FacetFiltersForm.renderSectionFromFetch(url, event);
    });
    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }
  static renderSectionFromFetch(url, event) {
    fetch(url)
    .then(response => response.text())
    .then((responseText) => {
      const html = responseText;
      FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
      FacetFiltersForm.renderFilters(html, event);
      FacetFiltersForm.renderProductGridContainer(html);
      //FacetFiltersForm.renderActiveFilter(html);
      typeof infinitescroll == 'object' && typeof infinitescroll?.scolljs == 'function' && infinitescroll?.scolljs()
      if(typeof quickAddButton == 'function'){
        quickAddButton();
      }
    });
    }
      static renderSectionFromCache(filterDataUrl, event) {
      const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
      FacetFiltersForm.renderFilters(html, event);
      FacetFiltersForm.renderProductGridContainer(html);
      //FacetFiltersForm.renderActiveFilter(html);
      if(typeof quickAddButton == 'function'){
        quickAddButton();
      }
    }
      static renderProductGridContainer(html) {
      document.getElementById('collection-grid').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('collection-grid').innerHTML;
    }
      static renderFilters(html, event) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const facetDetailsElements =
        parsedHTML.querySelectorAll('.filter-index');
      const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.filter-index') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    }
          const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    facetsToRender.forEach((element) => {
      document.querySelector(`.filter-index[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });
  }
  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }
  static getSections() {
    return [
      {
        section: document.getElementById('collection-grid').dataset.id,
      }
    ]
  }
  onSubmitHandler(event) {    
    event.preventDefault();
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();
    FacetFiltersForm.renderPage(searchParams, event);    
  }
}
FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();
function filterprice(){
  var inputLeft = document.querySelector(".price-left");
  var inputRight = document.querySelector(".price-right");
  var amountLeft = document.querySelector(".amount-left .amount-percentage");
  var amountRight = document.querySelector(".amount-right .amount-percentage");
  var thumbLeft = document.querySelector(".price-slider > .thumb.left");
  var thumbRight = document.querySelector(".price-slider > .thumb.right");
  var range = document.querySelector(".price-slider > .range");
  function setLeftValue() {
    var _this = inputLeft,
        min = parseInt(_this.min),
        max = parseInt(_this.max);
    _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
    var percent = ((_this.value - min) / (max - min)) * 100;
    thumbLeft.style.left = percent + "%";
    amountLeft.innerHTML = _this.value;
    range.style.left = percent + "%";
  }
  setLeftValue();
  function setRightValue() {
    var _this = inputRight,
        min = parseInt(_this.min),
        max = parseInt(_this.max);
    _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
    var percent = ((_this.value - min) / (max - min)) * 100;
    thumbRight.style.right = (100 - percent) + "%";
    amountRight.innerHTML = _this.value;
    range.style.right = (100 - percent) + "%";
    _this.style.zIndex  = 3;    
  }
  setRightValue();
  inputLeft.addEventListener("input", setLeftValue);
  inputRight.addEventListener("input", setRightValue);
}
if(document.querySelector('.range-wrap')){
  filterprice();
}
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
function fnBrowserDetect(){
  let userAgent = navigator.userAgent;
  let browserName;
  if(userAgent.match(/chrome|chromium|crios/i)){
    browserName = "chrome";
  }else if(userAgent.match(/firefox|fxios/i)){
    browserName = "firefox";
  }  else if(userAgent.match(/safari/i)){
    browserName = "safari";
  }else if(userAgent.match(/opr\//i)){
    browserName = "opera";
  } else if(userAgent.match(/edg/i)){
    browserName = "edge";
  }else{
    browserName="no-browser";
  }
  document.getElementById('MainContent').classList.add(browserName);
}
fnBrowserDetect()