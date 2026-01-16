function rafAsync() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
}
async function checkElement(selector) {
  let querySelector = null;
  while (querySelector === null) {
    await rafAsync();
    querySelector = document.querySelectorAll(selector);
  }
  return querySelector;
}
const createSingleInstanceOfJS = (assetURL, sectionSelector) => {
  const section = document.querySelector(sectionSelector);
  checkElement(sectionSelector)
  .then((element) => {
    const instance = document.querySelector("script[src*='" + assetURL + "']")
    if (instance === null) {
      const jsScript = document.createElement("script");
      jsScript.type = "text/javascript";
      jsScript.src = assetURL;
      element[element.length - 1]?.appendChild(jsScript);
    }
  })
}
const createSingleInstanceOfCSS = (assetURL, sectionSelector) => {
  const section = document.querySelector(sectionSelector);
  checkElement(sectionSelector)
  .then((element) => {
    const instance = document.querySelector('link[href*="' + assetURL + '"]')
    if (instance === null) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.media = "screen";
      cssLink.href = assetURL;
      element[0]?.prepend(cssLink);
    }
  })
}