/* Retain the shared viewer; correct its first-edition file:// PDF fallback for this edition. */
(() => {
  document.getElementById('pdf-link').href = new URL('retail/downloads/Bower_CRE_Retail.pdf', document.baseURI).href;
  document.querySelector('.viewer-brand img').src = new URL('3/assets/bower-logo.png', document.baseURI).href;
})();
