function accordian(){
  const accordions = document.querySelectorAll(".accordian-wrap");
  const openAccordion = (accordion) => {
    const content = accordion.querySelector(".accordian-content");
    accordion.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
  };
  const closeAccordion = (accordion) => {
    const content = accordion.querySelector(".accordian-content");
    accordion.classList.remove("active");
    content.style.maxHeight = null;
  };
//   var first_accordian = document.querySelector(".accordian-wrap");
//   if(first_accordian){
//     var first_content = first_accordian.querySelector(".accordian-content");    
//   }
//   if(first_content){
//     first_content.style.maxHeight = first_content.scrollHeight + "px";
//   }
  accordions.forEach((accordion) => {
    const intro = accordion.querySelector(".accordian-title");
    const content = accordion.querySelector(".accordian-content");
    intro.onclick = () => {
      if (content.style.maxHeight) {
        closeAccordion(accordion);
      } else {
        accordions.forEach((accordion) => closeAccordion(accordion));
        openAccordion(accordion);
      }
    };
  });
}
accordian();
document.addEventListener("shopify:section:load", function(event) {
  accordian();
});