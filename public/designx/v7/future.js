/* Supplied concept images carry the move from one room to a wider built world. */
(() => {
  'use strict';
  const views = [
    { id: 'garden-room', label: 'Garden room', alt: 'Two people seated beneath a timber pavilion colonised by wisteria in warm evening light.', position: '50% 62%' },
    { id: 'cultural-pavilion', label: 'Cultural pavilion', alt: 'A string quartet and audience gathered beneath a planted timber pavilion.', position: '50% 68%' },
    { id: 'living-building', label: 'Living building', alt: 'A concept for a larger glazed timber building enveloped in flowering vegetation.', position: '50% 66%' },
    { id: 'planted-street', label: 'Planted street', alt: 'A concept for a pedestrian street sheltered by planted timber arches.', position: '50% 68%' },
    { id: 'urban-fabric', label: 'Urban fabric', alt: 'A concept for an urban neighbourhood of planted buildings and shared public spaces.', position: '50% 68%' },
  ];
  const image = view => `v7/assets/future/${view.id}.webp`;
  window.DESIGNX_V7_FUTURE = {
    title: 'A room is the beginning.',
    html: `<section class="v7future-scene" data-v7future data-v7future-active="garden-room" aria-label="From a garden room to a living urban fabric">
      <div class="v7future-images" id="v7future-images">
        ${views.map((view, index) => `<figure class="v7future-image${index === 0 ? ' is-selected' : ''}" data-v7future-image="${view.id}" aria-hidden="${index !== 0}"><img src="${image(view)}" alt="${view.alt}" loading="lazy" style="object-position:${view.position}"></figure>`).join('')}
      </div>
      <div class="v7future-shade" aria-hidden="true"></div>
      <h2 class="v7future-title">A room is<br><em>the beginning.</em></h2>
      <div class="v7future-choices slide-interaction" role="group" aria-label="Explore architectural possibilities">
        ${views.map((view, index) => `<button type="button" class="v7future-choice" data-v7future-select="${view.id}" aria-pressed="${index === 0}" aria-controls="v7future-images"><img src="${image(view)}" alt="" loading="lazy" style="object-position:${view.position}"><span>${view.label}</span></button>`).join('')}
      </div>
      <p class="v7future-announcement sr-only" data-v7future-announcement aria-live="polite">Garden room</p>
      <div class="v7future-print">
        ${views.map(view => `<figure><img src="${image(view)}" alt="${view.alt}" loading="lazy" style="object-position:${view.position}"><figcaption>${view.label}</figcaption></figure>`).join('')}
      </div>
      <p class="v7future-status">Concept images · possibilities beyond the first Bower.</p>
    </section>`,
    notes: 'Begin with the inhabitable room: a place where structure, planting and human use can be tested together. These five user-supplied concept images expand that experience from an intimate garden setting to gathering, larger buildings, streets and urban fabric. They express the ambition that a repeatable design and manufacturing capability could eventually support. They are not photographs of completed Bowers or evidence that these larger applications have been engineered. Feasibility, maintenance, safety, lifecycle performance and the requirements of each scale remain to be demonstrated. Online, select a scale to inspect its image. The PDF presents all five concepts together.',
    source: 'Five concept images supplied by the founder, November 2026. Original filenames and image dimensions are recorded in v7/assets/future/provenance.json. Architectural possibilities, not completed projects or an engineered delivery roadmap.',
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-v7future]').forEach(scene => {
      const buttons = Array.from(scene.querySelectorAll('[data-v7future-select]'));
      const images = Array.from(scene.querySelectorAll('[data-v7future-image]'));
      let selected = 0;
      const select = (index, focus = false) => {
        selected = Math.max(0, Math.min(views.length - 1, index));
        const view = views[selected];
        scene.dataset.v7futureActive = view.id;
        buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === selected)));
        images.forEach((figure, position) => {
          const active = position === selected;
          figure.classList.toggle('is-selected', active);
          figure.setAttribute('aria-hidden', String(!active));
        });
        scene.querySelector('[data-v7future-announcement]').textContent = view.label;
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
