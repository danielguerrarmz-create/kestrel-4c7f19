/* Version 10 ecology sequence. Imported drawings retain their source record. */
(() => {
  'use strict';
  const drawings = [
  {
    "title": "Nature makes space",
    "theme": "v8-space-slide",
    "ecologyDrawing": "nature-makes-space",
    "caption": "Climbers change how much sky is visible between the timber ribs.",
    "alt": "Three timber bays in elevation. Climbers leaf out, flower, lose their leaves and return in the following summer.",
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
    "caption": "A proposed steel frame carries the pier above open rooting ground.",
    "alt": "A wisteria grows beside a timber pier. In section its roots extend below a steel frame between screw piles, and its stem climbs a cable beside the rib.",
    "purpose": "Show how a footing proposal could leave soil available to a climber.",
    "status": "Working section. The roots are illustrative and the footing has not been engineered."
  },
  {
    "title": "Six piers, six climbers",
    "theme": "v8-six-piers-slide",
    "ecologyDrawing": "six-piers-six-climbers",
    "caption": "Six lattice studies show how each climber grips its support or needs tying in.",
    "alt": "Six close views compare different climbing plants on six lattice forms, with foliage and flowers in colour.",
    "purpose": "Compare what different climbers look like where they meet their supports.",
    "status": "The six lattice forms were invented for this study. Support capacities have not been sized for mature planting."
  },
  {
    "title": "Why these plants",
    "theme": "v8-plant-palette-slide",
    "ecologyDrawing": "why-these-plants",
    "caption": "Twelve climbers make a different seasonal palette at each pier.",
    "alt": "Twelve labelled sprigs sit above six seasonal planting bands. The north-west pier has ivy alone.",
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
