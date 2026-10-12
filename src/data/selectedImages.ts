export const selectedImage = (slug: string): string => `/assets/selected/${slug}.webp`;

/** The approved 2026-10-06 Bower Marketing image selection, in stable editorial order. */
export const SELECTED_STUDIES = [
  { slug: '01-meadow-tea', title: 'Meadow Tea', alt: 'Concept visualisation of guests taking tea beneath a planted timber Bower in a meadow' },
  { slug: '02-timber-joint', title: 'Timber Joint', alt: 'Concept study of curved timber ribs meeting a primary arch at a fitted joint' },
  { slug: '03-wisteria-walk', title: 'Wisteria Walk', alt: 'Concept visualisation looking through a timber Bower planted with flowering wisteria' },
  { slug: '04-garden-exhibition', title: 'Garden Exhibition', alt: 'Concept visualisation of a public exhibition arranged inside a planted garden Bower' },
  { slug: '05-walled-garden', title: 'Walled Garden', alt: 'Concept visualisation of a timber Bower set within a mature walled garden' },
  { slug: '06-wedding-speech', title: 'Wedding Speech', alt: 'Concept visualisation of a wedding speech beneath a timber Bower at sunset' },
  { slug: '07-charity-dinner', title: 'Charity Dinner', alt: 'Concept visualisation of a singer performing during a charity dinner beneath a Bower' },
  { slug: '08-winter-family', title: 'Winter Family', alt: 'Concept visualisation of a family gathering beneath a timber Bower in winter' },
  { slug: '09-summer-family', title: 'Summer Family', alt: 'Concept visualisation of a family gathering beneath a planted timber Bower in summer' },
  { slug: '10-estate-aerial', title: 'Estate Aerial', alt: 'Aerial concept visualisation of a timber Bower within an estate garden' },
  { slug: '11-autumn-retreat', title: 'Autumn Retreat', alt: 'Concept visualisation of a quiet planted Bower in an autumn garden' },
  { slug: '12-orchard-approach', title: 'Orchard Approach', alt: 'Concept visualisation approaching a timber Bower through a flowering spring orchard' },
  { slug: '13-grape-oculus', title: 'Grape Oculus', alt: 'Interior concept visualisation looking through a planted timber oculus with grape vines' },
  { slug: '14-rose-wisteria', title: 'Rose Wisteria', alt: 'Concept visualisation looking through a timber canopy filled with roses and hanging wisteria' },
  { slug: '15-rose-reading', title: 'Rose Reading', alt: 'Concept visualisation of a quiet reading place beneath rose-covered timber arches' },
  { slug: '16-romantic-dinner', title: 'Romantic Dinner', alt: 'Concept visualisation of a candlelit dinner for two beneath a rose-covered timber Bower' },
  { slug: '17-memorial-garden', title: 'Memorial Garden', alt: 'Concept visualisation of a contemplative autumn Bower beside a garden memorial' },
  { slug: '18-autumn-dinner', title: 'Autumn Dinner', alt: 'Concept visualisation of an intimate dinner beneath a red autumn canopy' },
  { slug: '19-floral-canopy', title: 'Floral Canopy', alt: 'Upward concept view through flowering plants woven into a timber canopy' },
  { slug: '20-autumn-canopy', title: 'Autumn Canopy', alt: 'Upward concept view through a timber canopy filled with red autumn foliage' },
  { slug: '21-woodland-bower', title: 'Woodland Bower', alt: 'Concept visualisation of a shaded woodland garden room within a timber lattice' },
  { slug: '22-wisteria-banquet', title: 'Wisteria Banquet', alt: 'Concept visualisation of a candlelit banquet beneath a mature wisteria canopy' },
  { slug: '23-white-wisteria', title: 'White Wisteria', alt: 'Concept visualisation of evening dinner tables beneath white wisteria and timber arches' },
  { slug: '24-candlelit-canopy', title: 'Candlelit Canopy', alt: 'Concept visualisation of dinner tables within a candlelit flowering timber canopy' },
  { slug: '25-new-bower', title: 'New Bower', alt: 'Concept visualisation of a newly installed timber Bower with young planting' },
  { slug: '26-growing-bower', title: 'Growing Bower', alt: 'Concept visualisation of the same Bower garden after about twenty years of growth' },
  { slug: '27-mature-bower', title: 'Mature Bower', alt: 'Concept visualisation of the same Bower garden after about sixty years of growth' },
  { slug: '28-winter-bower', title: 'Winter Bower', alt: 'Concept visualisation of the mature Bower garden in winter with dormant climbers' },
  { slug: '29-wisteria-theatre', title: 'Wisteria Theatre', alt: 'Concept visualisation of a chamber concert beneath a mature wisteria-covered Bower at sunset' },
  { slug: '30-ancient-bower', title: 'Ancient Bower', alt: 'Concept visualisation of a century-old flowering timber Bower beside a veteran tree' },
  { slug: '31-family-supper', title: 'Family Supper', alt: 'Concept visualisation of an intimate family supper beneath flowering timber arches' },
  { slug: '32-floral-detail', title: 'Floral Detail', alt: 'Close concept view of roses and flowering plants woven around curved timber' },
  { slug: '33-spring-opening', title: 'Spring Opening', alt: 'Concept visualisation of a family arriving while gardeners tend a spring Bower' },
  { slug: '34-summer-dance', title: 'Summer Dance', alt: 'Concept visualisation of music and dancing beneath a flowering summer Bower' },
  { slug: '35-autumn-harvest', title: 'Autumn Harvest', alt: 'Concept visualisation of a family harvest meal beneath autumn foliage' },
  { slug: '36-winter-walk', title: 'Winter Walk', alt: 'Concept visualisation of a quiet lantern walk through a snow-covered Bower' },
] as const;

export type SelectedStudy = (typeof SELECTED_STUDIES)[number];

export function selectedStudy(slug: SelectedStudy['slug']): SelectedStudy {
  const study = SELECTED_STUDIES.find((item) => item.slug === slug);
  if (!study) throw new Error(`Unknown selected study: ${slug}`);
  return study;
}
