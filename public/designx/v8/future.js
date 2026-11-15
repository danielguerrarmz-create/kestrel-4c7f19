/* Supplied concept images carry the move from one room to a wider built world. */
(() => {
  'use strict';
  const views = [
  {
    "id": "sanctuary",
    "label": "Sanctuary",
    "alt": "Concept of a planted timber sanctuary with curved pews, an altar and an open vaulted canopy.",
    "position": "50% 50%"
  },
  {
    "id": "civic-promenade",
    "label": "Civic promenade",
    "alt": "Concept of people walking beneath flowering timber arches beside planted cafe terraces.",
    "position": "50% 50%"
  },
  {
    "id": "living-street",
    "label": "Living street",
    "alt": "Concept of a busy pedestrian street framed by planted timber vaults, shops and shared seating.",
    "position": "50% 50%"
  },
  {
    "id": "living-building",
    "label": "Living building",
    "alt": "Concept of glazed multistorey timber buildings linked by bridges above a planted courtyard and water.",
    "position": "50% 50%"
  },
  {
    "id": "garden-city",
    "label": "Garden city",
    "alt": "Concept of a neighbourhood of planted timber buildings, pedestrian routes and water at sunset.",
    "position": "50% 50%"
  }
];
  const image = view => `v8/assets/future/${view.id}.webp`;
  window.DESIGNX_V8_FUTURE = {
    title: 'A room is the beginning.',
    html: `<section class="v7future-scene" data-v8future data-v8future-active="sanctuary" aria-label="From a sanctuary to a living garden city">
      <div class="v7future-images" id="v7future-images">
        ${views.map((view, index) => `<figure class="v7future-image${index === 0 ? ' is-selected' : ''}" data-v8future-image="${view.id}" aria-hidden="${index !== 0}"><img src="${image(view)}" alt="${view.alt}" loading="lazy" style="object-position:${view.position}"></figure>`).join('')}
      </div>
      <div class="v7future-shade" aria-hidden="true"></div>
      <h2 class="v7future-title">A room is<br><em>the beginning.</em></h2>
      <div class="v7future-choices slide-interaction" role="group" aria-label="Explore architectural possibilities">
        ${views.map((view, index) => `<button type="button" class="v7future-choice" data-v8future-select="${view.id}" aria-pressed="${index === 0}" aria-controls="v7future-images"><img src="${image(view)}" alt="" loading="lazy" style="object-position:${view.position}"><span>${view.label}</span></button>`).join('')}
      </div>
      <p class="v7future-announcement sr-only" data-v8future-announcement aria-live="polite">Sanctuary</p>
      <div class="v7future-print">
        ${views.map(view => `<figure><img src="${image(view)}" alt="${view.alt}" loading="lazy" style="object-position:${view.position}"><figcaption>${view.label}</figcaption></figure>`).join('')}
      </div>
      <p class="v7future-status">Concept images · possibilities beyond the first Bower.</p>
    </section>`,
    notes: 'Begin with the inhabitable room: a place where structure, planting and human use can be tested together. These five user-supplied concept images expand that experience through a sanctuary, civic promenade, living street, larger building and garden city. They express the ambition that a repeatable design and manufacturing capability could eventually support. They are not photographs of completed Bowers or evidence that these larger applications have been engineered. Feasibility, maintenance, safety, lifecycle performance and the requirements of each scale remain to be demonstrated. Online, select a scale to inspect its image. The PDF presents all five concepts together.',
    source: 'Five replacement concept images supplied by the founder on 15 November 2026. Original filenames and image dimensions are recorded in v8/assets/future/provenance.json. Architectural possibilities, not completed projects or an engineered delivery roadmap.',
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-v8future]').forEach(scene => {
      const buttons = Array.from(scene.querySelectorAll('[data-v8future-select]'));
      const images = Array.from(scene.querySelectorAll('[data-v8future-image]'));
      let selected = 0;
      const select = (index, focus = false) => {
        selected = Math.max(0, Math.min(views.length - 1, index));
        const view = views[selected];
        scene.dataset.v8futureActive = view.id;
        buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === selected)));
        images.forEach((figure, position) => {
          const active = position === selected;
          figure.classList.toggle('is-selected', active);
          figure.setAttribute('aria-hidden', String(!active));
        });
        scene.querySelector('[data-v8future-announcement]').textContent = view.label;
        if (focus) buttons[selected].focus();
      };
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => select(index));
        button.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault(); event.stopPropagation();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? views.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1);
          select(next, true);
        });
      });
    });
  });
})();
