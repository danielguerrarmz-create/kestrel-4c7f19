/* Preserve the customer triptych while bringing its prospects and media up to date. */
(() => {
  'use strict';
  window.DESIGNX_V8_CUSTOMERS = original => {
    const template = document.createElement('template');
    template.innerHTML = original.html;
    const content = template.content;
    content.querySelectorAll('[data-customer-film], [data-customer-play], .prospect-logo-canary').forEach(element => element.remove());
    const strip = content.querySelector('.prospect-strip');
    strip.setAttribute('aria-label', 'Prospective customer conversations');
    content.querySelector('.source-note').textContent = 'Customer conversations, not signed commissions. Images are Bower concepts, not work for these organisations.';
    return { ...original, html:template.innerHTML,
      notes:'Private gardens, cultural destinations and hospitality are prospective settings for the first Bowers. The Eden Project, The Newt and 25hours represent actual customer-discovery meetings, as clarified by the founder. These conversations are not signed commissions or endorsements. Canary Wharf Group is at an earlier stage and is not shown in the logo strip: the founder reports cold outreach and the Bower website leading to a CEO introduction, with an upcoming discussion with the head of development. No completed meeting or commission with Canary Wharf Group is claimed. No individual concept image represents a commission from, or a proposal for, any named organisation. All three customer images are still concepts; the hospitality film and its controls are omitted in this edition. The slide follows the manufacturing explanation and introduces the commercial discussion.',
      source:'Founder-confirmed prospect names and distinction between completed customer-discovery meetings and early Canary Wharf Group interest, November 2026. Official provenance for the three displayed logos is in 3/assets/prospects/sources.json. Customer concepts remain the existing Bower images.' };
  };
})();
