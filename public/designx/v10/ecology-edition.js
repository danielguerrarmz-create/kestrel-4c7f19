/* Version 10 ecology sequence. Imported drawings retain their source record. */
(() => {
  'use strict';
  const drawings = [
  {
    "title": "Nature makes space",
    "theme": "v8-space-slide",
    "ecologyDrawing": "nature-makes-space",
    "caption": "In spring, wisteria hangs below the planted canopy.",
    "alt": "A cut through the planted timber room in spring. Roots spread beside the piers and wisteria flowers hang over the path. The seasonal study also shows a fuller summer canopy, crimson autumn leaves and bare winter stems alongside ivy.",
    "purpose": "Show how planting can change the enclosure of a timber room through the seasons.",
    "status": "Seasonal relationships are illustrative. Stems, leaves and flowers are drawn by eye."
  },
  {
    "title": "The living place",
    "theme": "v8-ground-slide",
    "ecologyDrawing": "the-living-place",
    "caption": "Paths, a swale and an old oak surround the six planted piers.",
    "alt": "An isometric cutaway of the planted Bower with paths around an oak, a meadow and a swale. The cut ground shows roots and soil layers.",
    "purpose": "Place the planted room among paths, established trees and water.",
    "status": "Frame and cable geometry come from the open-pier model. Growth follows one illustrative simulator run. The site and soil are drawn by eye."
  },
  {
    "title": "Rooted before it climbs",
    "theme": "v8-rooted-slide",
    "ecologyDrawing": "rooted-before-it-climbs",
    "caption": "A stainless steel sleeve surrounds the timber where it enters the planting bed.",
    "alt": "Proposed section through a sleeved timber pier at the soil line. Wisteria roots spread beside a buried steel frame on screw piles.",
    "purpose": "Show how a footing proposal could leave soil available to a climber.",
    "status": "Concept detail. Drainage, timber durability, access for inspection and the foundation require engineering review. Roots are illustrative.",
    "note": "Concept detail. Drainage and timber durability need engineering review."
  },
  {
    "title": "One pier, four climbers",
    "theme": "v8-six-piers-slide",
    "ecologyDrawing": "six-piers-six-climbers",
    "caption": "The south-west pier planting, with each climber shown in flower.",
    "alt": "Chinese wisteria, climbing rose, star jasmine and winter clematis share a single timber fan with cables, ties and fine laths.",
    "purpose": "Show how four climbing habits can share a timber pier in the trial palette.",
    "status": "The planting comes from the south-west pier schedule. The support arrangement and flowering composite are illustrative."
  },
  {
    "title": "Why these plants",
    "theme": "v8-plant-palette-slide",
    "ecologyDrawing": "why-these-plants",
    "caption": "Twelve climbers make a different seasonal palette at each pier.",
    "alt": "Twelve labelled sprigs sit above six flower-shaped calendars. Reading clockwise from January shows which plants flower, scent or turn red at each pier. The north-west pier has ivy alone.",
    "purpose": "Compare leaf habit, flowering periods and scent across the six piers.",
    "status": "Months and leaf habit come from the species records. This working palette substitutes star jasmine and ivy for two trial species. Planting approval and horticultural review remain open."
  }
];
  const slides = window.DESIGNX_SLIDES;
  const make = item => ({
    title: item.title, theme: item.theme, act: 'A living place',
    comparisonIndex: 3, sourceIndex: 3,
    html: window.DESIGNX_V10_ECOLOGY.html(item),
    notes: item.purpose + ' ' + item.status,
    source: 'Bower ecology working drawings. See assets/ecology-drawings/SOURCES.md.'
  });
  const space = slides.findIndex(slide => slide.theme.split(' ').includes('v8-space-slide'));
  const place = slides.findIndex(slide => slide.theme.split(' ').includes('v8-ground-slide'));
  if (space < 0 || place < 0) throw new Error('The Version 10 ecology sequence needs its space and site slides.');
  slides[space] = make(drawings[0]);
  slides.splice(place, 1, ...drawings.slice(1).map(make));
  const canopy = slides.find(slide => slide.theme.split(' ').includes('v8-canopy-orbit-slide'));
  const template = document.createElement('template');
  template.innerHTML = canopy.html;
  template.content.querySelector('.v7-title').classList.remove('sr-only');
  canopy.html = template.innerHTML;
  window.DESIGNX_META = Object.freeze({ ...window.DESIGNX_META, targetSlideCount: slides.length });
})();
