/* Preserve the customer triptych while bringing its prospects and media up to date. */
(() => {
  'use strict';
  window.DESIGNX_V8_CUSTOMERS = original => {
    const template = document.createElement('template');
    template.innerHTML = original.html;
    const content = template.content;
    content.querySelectorAll('[data-customer-film], [data-customer-play]').forEach(element => element.remove());
    const strip = content.querySelector('.prospect-strip');
    strip.setAttribute('aria-label', 'Prospective customer conversations and an upcoming meeting');
    strip.insertAdjacentHTML('beforeend', `<a class="prospect-logo prospect-logo-canary" href="https://cwg.com/" target="_blank" rel="noopener"><img src="v8/assets/prospects/canary-wharf-group.png" alt="Canary Wharf Group" loading="lazy"><span>Meeting scheduled</span></a>`);
    content.querySelector('.source-note').textContent = 'Conversations and upcoming meetings, not signed commissions. Images are Bower concepts, not work for these organisations.';
    return { ...original, html:template.innerHTML,
      notes:'Private gardens, cultural destinations and hospitality are prospective settings for the first Bowers. Discussions with the Eden Project, The Newt and 25hours were founder-confirmed on 13 November 2026. On 15 November the founder asked to add Canary Wharf Group, reporting a meeting this week. This is an upcoming meeting, not a completed discussion, commission or endorsement. No individual concept image represents a commission from, or a proposal for, any named organisation. All three customer images are still concepts; the hospitality film and its controls are omitted in this edition. The slide follows the manufacturing explanation and introduces the commercial discussion.',
      source:'Founder-confirmed prospect names and meeting status. Existing official logo provenance is in 3/assets/prospects/sources.json; the Canary Wharf Group mark is recorded in v8/assets/prospects/sources.json. Customer concepts remain the existing Bower images.' };
  };
})();
