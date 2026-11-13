/* Commercial flywheel: purpose-drawn illustrations of an intended sequence.
   All photographs are crops of the same existing, unbuilt Bower concept.
   These are not customer sites, completed case studies or production drawings. */
(() => {
  'use strict';
  const ink = '#102820';
  const leaf = '#C1D98A';
  const soft = '#89A082';
  const paper = '#F0F2E8';
  const photo = 'assets/cover.webp';
  const svg = (kind, body) => `<svg class="v4-commercial-art v4-commercial-art-${kind}" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const crop = (x, y, width, height, viewBox = '0 0 2400 1324') => `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice"><image href="${photo}" x="0" y="0" width="2400" height="1324" preserveAspectRatio="none"/></svg>`;
  // One consistent, schematic timber room; hand-authored lattice curves.
  const bower = (x, y, scale = 1, colour = ink) => `<g transform="translate(${x} ${y}) scale(${scale})" stroke="${colour}">
    <path d="M-72 43Q-66-37 0-53Q66-37 72 43M-72 43Q-39-16 0-31Q39-16 72 43M-72 43Q-24 13 0 11Q24 13 72 43" stroke-width="2.4"/>
    <path d="M-72 43Q-18-13 0-53Q18-13 72 43M-57 33Q-30-27 0-53Q30-27 57 33M-36 19Q-27-23 0-53Q27-23 36 19M-72 43Q-14-26 37-31M72 43Q14-26-37-31" stroke-width="1.2" opacity=".8"/>
    <path d="M-72 43V52M72 43V52M-35 21V31M35 21V31M-80 53H80" stroke-width="1.6"/>
  </g>`;
  const plan = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})" stroke="${ink}">
    <ellipse rx="80" ry="48" fill="${leaf}" fill-opacity=".48" stroke-width="2"/>
    <ellipse rx="57" ry="34" stroke-width="1"/>
    <ellipse rx="22" ry="13" stroke-width="1.6"/>
    ${Array.from({length: 12}, (_, i) => {
      const a = i * Math.PI / 6;
      return `<path d="M${(22 * Math.cos(a)).toFixed(2)} ${(13 * Math.sin(a)).toFixed(2)}L${(80 * Math.cos(a)).toFixed(2)} ${(48 * Math.sin(a)).toFixed(2)}" stroke-width="1"/>`;
    }).join('')}
    <path d="M-91 0H91M0-59V59" stroke-dasharray="3 5" stroke-width=".8" opacity=".5"/>
  </g>`;
  const frame = (x, y, width, height) => `<path d="M${x + 20} ${y}H${x}V${y + 20}M${x + width - 20} ${y}H${x + width}V${y + 20}M${x} ${y + height - 20}V${y + height}H${x + 20}M${x + width - 20} ${y + height}H${x + width}V${y + height - 20}" stroke="${ink}" stroke-width="1.5"/>`;

  const commission = svg('commission', `
    <g stroke="${soft}" stroke-width="1" opacity=".52">
      <path d="M8 85C66 19 155 27 202 55S325 124 392 65"/>
      <path d="M8 108C69 42 150 48 204 78S327 148 392 89"/>
      <path d="M8 134C66 66 147 69 205 103S332 171 392 114"/>
      <path d="M8 161C64 93 145 95 207 131S335 195 392 142"/>
      <path d="M8 191C62 119 143 123 209 160S339 221 392 172"/>
      <path d="M8 224C65 153 144 153 209 193S341 253 392 205"/>
      <path d="M8 259C66 186 147 184 210 226S342 284 392 241"/>
    </g>
    <path d="M49 80L322 48L359 242L88 280Z" stroke="${ink}" stroke-width="1.4" stroke-dasharray="5 6"/>
    <path d="M47 246C98 245 117 210 150 190" stroke="${paper}" stroke-width="14"/>
    <path d="M47 246C98 245 117 210 150 190" stroke="${soft}" stroke-width="1.5"/>
    ${plan(210, 159, 1.15)}
    <circle cx="210" cy="159" r="5" fill="${ink}"/>
    <path d="M306 211H349V253" stroke="${ink}" stroke-width="2"/>
    <path d="M349 211L321 239" stroke="${ink}" stroke-width="2"/>
    <path d="M37 38V62M25 50H49" stroke="${ink}" stroke-width="1"/>
  `);

  const builtBower = svg('bower', `
    ${crop(16, 19, 368, 282)}
    <path d="M16 265V301H52M348 301H384V265" stroke="${leaf}" stroke-width="3"/>
  `);

  const reference = svg('reference', `
    <rect x="27" y="14" width="346" height="293" fill="${paper}" stroke="${soft}" stroke-width="1"/>
    ${crop(39, 26, 322, 174)}
    ${crop(39, 212, 155, 82, '200 0 1150 660')}
    ${crop(206, 212, 155, 82, '1120 30 1000 560')}
    <path d="M13 28V0H41M359 0H387V28M13 292V320H41M359 320H387V292" stroke="${ink}" stroke-width="1"/>
  `);

  const demand = svg('demand', `
    <path d="M199 128C194 172 131 155 97 200M201 128C206 172 269 155 303 200" stroke="${soft}" stroke-width="1.8"/>
    <path d="M89 190L97 200L110 197M290 197L303 200L311 190" stroke="${soft}" stroke-width="1.8"/>
    <path d="M199 249C172 278 128 278 99 255M201 249C228 278 272 278 301 255" stroke="${soft}" stroke-width="1" stroke-dasharray="3 5"/>
    <path d="M113 91L200 57L287 91L200 133Z" fill="${leaf}" fill-opacity=".7" stroke="${soft}" stroke-width="1"/>
    <path d="M18 235L97 204L176 235L97 273Z" fill="${leaf}" fill-opacity=".35" stroke="${soft}" stroke-width="1"/>
    <path d="M224 235L303 204L382 235L303 273Z" fill="${leaf}" fill-opacity=".35" stroke="${soft}" stroke-width="1"/>
    ${bower(200, 72, .9)}
    <g stroke="${soft}" stroke-width=".9" opacity=".8">
      <path d="M40 237C74 217 103 243 149 231M59 249C87 231 114 252 136 243"/>
      <path d="M248 235C274 222 305 247 355 231M269 247C290 238 315 252 338 244"/>
    </g>
  `);

  const reinvest = svg('reinvest', `
    ${bower(200, 56, .7)}
    <path d="M200 107V138M69 167V138H331V167M200 138V167" stroke="${soft}" stroke-width="1.6"/>
    <path d="M63 160L69 167L75 160M194 160L200 167L206 160M325 160L331 167L337 160" stroke="${soft}" stroke-width="1.6"/>
    <g stroke="${ink}">
      <path d="M27 236Q69 167 111 236M34 236Q69 189 104 236M46 236Q69 211 92 236" stroke-width="2"/>
      <path d="M27 247H111M69 181V252" stroke="${soft}" stroke-width=".8" stroke-dasharray="3 5"/>
      <circle cx="27" cy="236" r="3" fill="${leaf}"/><circle cx="69" cy="202" r="3" fill="${leaf}"/><circle cx="111" cy="236" r="3" fill="${leaf}"/>
      <path d="M160 215Q194 185 237 196L239 204Q197 193 164 222ZM161 234Q197 212 240 218L241 226Q198 220 165 241ZM163 252Q200 239 241 244L242 252Q201 247 165 259Z" fill="${leaf}" fill-opacity=".45" stroke-width="1.3"/>
      <path d="M286 249H371M293 249V205H364V249M303 205V191H354V205M328 205V226M320 226H336L333 235H323Z" stroke-width="2"/>
      <path d="M307 243Q331 221 355 243" stroke-width="3"/>
      <path d="M286 262H371" stroke="${soft}" stroke-width="1"/>
    </g>
    <path d="M34 285C-3 271 0 108 51 64C73 45 99 39 128 41" stroke="${soft}" stroke-width="1.4"/>
    <path d="M118 34L128 41L116 46" stroke="${soft}" stroke-width="1.4"/>
  `);

  const nextCycle = svg('next-cycle', `
    ${crop(24, 58, 190, 199, '0 80 1600 1200')}
    <path d="M224 58H376V257H224" fill="${leaf}" fill-opacity=".35" stroke="${soft}" stroke-width="1"/>
    ${bower(300, 135, .76)}
    <path d="M244 207Q299 176 355 193L357 201Q301 185 247 214ZM247 229Q300 206 357 216L358 224Q302 215 250 236Z" fill="${leaf}" fill-opacity=".7" stroke="${ink}" stroke-width="1.2"/>
    <path d="M40 37C135 5 269 5 360 37M40 280C135 311 269 311 360 280" stroke="${soft}" stroke-width="1.6"/>
    <path d="M349 26L360 37L344 39M53 277L40 280L48 291" stroke="${soft}" stroke-width="1.6"/>
    ${frame(24, 58, 352, 199)}
  `);

  window.DESIGNX4_COMMERCIAL_VISUALS = Object.freeze([
    { stage: 'Commission', caption: 'A place to begin.', alt: 'Schematic garden plot with one selected Bower footprint. An illustrative commission, not an actual client site.', markup: commission },
    { stage: 'Bower', caption: 'A place people can experience.', alt: 'The existing planted Bower concept, illustrating the intended built experience. This is not a completed building.', markup: builtBower },
    { stage: 'Reference', caption: 'Something others can see.', alt: 'An illustrative reference spread with a full view and two detail crops of the same Bower concept. It is not a published case study.', markup: reference },
    { stage: 'Demand', caption: 'The possibility travels.', alt: 'One schematic Bower reference connecting to two empty possible future sites, illustrating interest rather than completed buildings or recorded customer enquiries.', markup: demand },
    { stage: 'Reinvest', caption: 'Design rules. Workflows. Tooling.', alt: 'Project resources returning to reusable geometry, component workflows and fabrication tooling. These represent intended capabilities, not an operating factory.', markup: reinvest },
    { stage: 'The next cycle', caption: 'A stronger starting point.', alt: 'The Bower concept paired with reusable design and fabrication knowledge, illustrating the intended return into the next commission.', markup: nextCycle }
  ]);
})();
