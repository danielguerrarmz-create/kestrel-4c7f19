/* Version 10 opening, loaded before the viewer builds its index. */
(() => {
  'use strict';
  const slides = window.DESIGNX_SLIDES;
  const cover = slides[0];
  const template = document.createElement('template');
  template.innerHTML = cover.html;
  template.content.querySelector('.cover-proposition').innerHTML =
    'We want the places where we gather every day<br>to bring us closer to the living world.';
  cover.html = template.innerHTML;
  cover.theme += ' mission-cover';

  const params = new URLSearchParams(location.search);
  const previousSettings = new Map([
    ['meadow', ''], ['city-original', 'urban-'], ['city-weather', 'weather-']
  ]);
  const prefix = previousSettings.get(params.get('setting')) ?? 'cast-';
  const meadow = prefix === '';
  const currentCast = prefix === 'cast-';
  const seasonalWeather = currentCast || prefix === 'weather-';
  const assets = 'v10/assets/mission-opening/';
  const imagePath = name => assets + (currentCast && name === 'winter-two.webp' ? 'urban-' : prefix) + name;
  const visits = [
    {
      stage: 'day', file: 'opening-day.webp', title: 'Opening day.',
      weatherAlt: 'The open ribs cast sharp shadows across the paving. Beside the new bench, a child offers her mother a pebble while her father crouches close. A greengrocer sets out fruit across the square.',
      caption: 'A child brings a pebble to the new bench. Above them, the ribs are open to the sky.',
      alt: meadow
        ? 'A small child holds out a pebble to a parent seated on the new oak bench. Fresh timber ribs frame the summer meadow.'
        : 'A curly-haired child shows her mother a pebble beside the new bench as her father crouches next to her. Cyclists and café customers pass behind the open timber arches.'
    },
    {
      stage: 'autumn', file: 'autumn-one.webp', title: 'First autumn.',
      weatherAlt: currentCast
        ? 'The father holds a broad umbrella over the family. His daughter points to rings in a puddle as rain falls through the open timber ribs. Across the street, traders pull in their awning.'
        : 'The child stoops for a leaf on the wet paving as her mother bends beside her. Rain sweeps across the square behind them and people shelter by the café.',
      caption: currentCast
        ? 'Rain falls through the open ribs. Under the umbrella, she points out the ripples.'
        : meadow ? 'Leaves gather at the edge of the path.' : 'She stops for a fallen leaf. Her father carries her little backpack.',
      alt: meadow
        ? 'A man leans against a timber pier while a woman in a rust-coloured coat walks into the tawny meadow. Leaves collect by the empty bench.'
        : 'On the rain-darkened paving, the child crouches for a copper leaf. Her mother bends beside her and her father holds her bag while neighbours cross the street.'
    },
    {
      stage: 'winter', file: 'winter-two.webp', title: 'Second winter.',
      weatherAlt: currentCast
        ? 'The family crosses the wet paving beneath bare ribs. Through the arch, the pale corner building and green café are visible beyond the bench.'
        : 'The family crosses the frosted square hand in hand. A cyclist fades into blue fog.',
      caption: meadow ? 'Frost settles on the empty bench. Two figures follow the worn path into the meadow.' : 'She takes her father’s hand as they cross the winter square.',
      alt: meadow
        ? 'Two adults in winter coats walk away together. Frost picks out the bench slats and grass below bare branches.'
        : 'The child in a mustard scarf holds her father’s hand as her mother walks alongside them with a travel mug. The bench is frosted and warm café windows glow beyond the bare vines.'
    },
    {
      stage: 'spring', file: 'spring-four.webp', title: 'Fourth spring.',
      weatherAlt: currentCast
        ? 'Sunlight catches the wet paving after a shower. The child and her mother look at bluebells while her father waits with his bicycle. Neighbours stop at the flower stall.'
        : 'A sun shower catches the fresh leaves above the child and her mother as they look at bluebells. Her father waits with his bicycle and a flower stall stands across the square.',
      caption: meadow ? 'The child stops for bluebells where the gravel meets the grass.' : 'The bluebells are out. Her father waits with the bike.',
      alt: meadow
        ? 'The growing child and a parent crouch beside spring flowers. Lichen marks the stones and the exposed oak has turned grey.'
        : 'The child and her mother look at bluebells beneath a silvering timber pier. Her father holds a bicycle nearby as people pass the corner café.'
    },
    {
      stage: 'summer', file: 'five-summers.webp', title: 'Five summers later.',
      weatherAlt: 'Low sun lights the wisteria the child points out to her parents. Outside the café a guitarist and violinist play to a handful of neighbours in the shade.',
      caption: 'The child who brought the pebble now points out the wisteria.',
      alt: meadow
        ? 'The older child points up at purple flowers on the weathered arch. Their parents watch from beyond the silvered bench.'
        : 'Now taller, the child points out lilac wisteria hanging from the weathered arch. Both parents follow her gaze. Beyond them, someone locks a bike and neighbours gather outside the café.'
    }
  ];
  const printView = params.get('print') === '1';
  const photoHTML = visit =>
    `<img class="mission-photo" decoding="async" src="${imagePath(visit.file)}" alt="${seasonalWeather ? visit.weatherAlt : visit.alt}">`;
  const connectedStreets = currentCast && params.get('street') !== 'original';
  const streetImage = imagePath(connectedStreets ? 'connected-streets.webp' : 'living-street.webp');
  const originalStreetAlt = meadow
    ? 'A pedestrian street beneath a succession of planted timber arches.'
    : seasonalWeather
      ? 'The family walks past the green café as neighbours listen to two musicians under the nearest timber arch. The low sun throws long shadows across the street.'
      : 'The family walks past the green corner café. Beyond them, planted timber rooms repeat along a city block of brick homes, shops and busy pavements.';
  const streetAlt = connectedStreets
    ? 'The family passes musicians at the corner café. Over the junction a wisteria-covered timber canopy forks around a brick corner building and continues down both streets.'
    : originalStreetAlt;

  slides.splice(1, 0, {
    title: 'Opening day. Five summers later.', theme: 'mission-scene', act: cover.act, comparisonIndex: cover.comparisonIndex,
    html: `<section class="mission-visit mission-room" data-phase="day" aria-label="Five visits to the same room">
      ${visits.map((visit, index) => `<figure class="mission-moment${index === 0 ? ' is-current' : ''}" data-moment="${visit.stage}">
        ${index === 0 || printView ? photoHTML(visit) : ''}
        <figcaption><h2>${visit.title}</h2><p>${visit.caption}</p></figcaption>
      </figure>`).join('')}
    </section>`,
    notes: visits.map(visit => visit.caption).join(' '),
    source: 'Five architectural concept renders of the same room. The sequence imagines seasonal change, weathering and occupation over five years.'
  }, {
    title: 'A living street.', theme: 'mission-scene', act: cover.act, comparisonIndex: cover.comparisonIndex,
    html: `<section class="mission-visit">
      <img class="mission-photo mission-street" src="${streetImage}" alt="${streetAlt}">
      <div class="mission-caption"><h2>A living street.</h2><p>Now imagine this on your walk home.</p></div>
    </section>`,
    notes: 'Imagine encountering a planted timber canopy as part of an everyday walk.',
    source: 'Living street architectural concept render.'
  });
  window.DESIGNX_META = Object.freeze({ ...window.DESIGNX_META, targetSlideCount: slides.length });

  (window.DESIGNX_MOUNTS ||= []).push(deck => {
    const room = deck.querySelector('.mission-room');
    if (!room || printView) return;
    const slide = room.closest('.slide');
    const frames = [...room.querySelectorAll('.mission-moment')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const openingHold = 3000;
    const visitHold = 2300;
    const fade = 900;
    room.style.setProperty('--mission-dissolve', `${fade}ms`);

    let current = 0;
    let active = false;
    let printing = false;
    let timer;
    let clockStarted = null;
    let remaining = openingHold;
    let sequence = 0;

    // Prepare the current and following visit. Loading the cover only requests the opening photograph.
    function imageAt(index) {
      const frame = frames[index];
      let image = frame.querySelector('img');
      if (!image || (image.complete && !image.naturalWidth)) {
        image?.remove();
        frame.insertAdjacentHTML('afterbegin', photoHTML(visits[index]));
        image = frame.querySelector('img');
      }
      return image;
    }

    function stopClock() {
      clearTimeout(timer);
      if (clockStarted !== null) remaining = Math.max(0, remaining - (performance.now() - clockStarted));
      clockStarted = null;
      sequence++;
    }

    function show(index, dissolve) {
      const previous = current;
      current = index;
      room.dataset.phase = visits[index].stage;
      frames.forEach((frame, i) => {
        frame.classList.toggle('is-previous', dissolve && i === previous && i !== index);
        frame.classList.toggle('is-current', i === index);
        frame.classList.toggle('is-dissolving', dissolve && i === index);
        frame.setAttribute('aria-hidden', String(i !== index));
      });
      remaining = (index === 0 ? openingHold : visitHold) + (dissolve ? fade : 0);
    }

    async function advance(token) {
      clockStarted = null;
      remaining = 0;
      for (let index = current + 1; token === sequence && index < visits.length; index++) {
        try { await imageAt(index).decode(); }
        catch { continue; }
        if (token !== sequence) return;
        show(index, !reducedMotion.matches);
        startClock();
        return;
      }
    }

    async function startClock() {
      if (!active || printing || document.hidden || current === visits.length - 1) return;
      const token = sequence;
      try { await imageAt(current).decode(); }
      catch { if (token === sequence) advance(token); return; }
      if (token !== sequence) return;
      // Decode one visit ahead while this one is on screen. A slow or failed load is retried at the cut.
      imageAt(current + 1).decode().catch(() => {});
      // The hold starts on a visible frame after the photograph has decoded.
      requestAnimationFrame(() => {
        if (sequence !== token) return;
        clockStarted = performance.now();
        timer = setTimeout(() => advance(token), remaining);
      });
    }

    document.addEventListener('designx:slidechange', ({ detail }) => {
      const nextActive = detail.element === slide;
      if (nextActive === active) return;
      stopClock();
      active = nextActive;
      if (active) {
        show(0, false);
        startClock();
      }
    });
    document.addEventListener('visibilitychange', () => { stopClock(); startClock(); });
    window.addEventListener('beforeprint', () => {
      printing = true;
      stopClock();
      frames.forEach((frame, index) => { imageAt(index); frame.removeAttribute('aria-hidden'); });
    });
    window.addEventListener('afterprint', () => {
      printing = false;
      frames.forEach((frame, i) => frame.setAttribute('aria-hidden', String(i !== current)));
      startClock();
    });
  });
})();
