export interface CompanionPair {
  plant1: string;
  plant2: string;
  relationship: "good" | "bad";
  reason: string;
}

export const companionPairs: CompanionPair[] = [
  // Good companions
  { plant1: "tomato", plant2: "basil", relationship: "good", reason: "Basil repels aphids and whitefly, enhances tomato flavor" },
  { plant1: "tomato", plant2: "marigold", relationship: "good", reason: "Marigolds deter nematodes and whitefly" },
  { plant1: "tomato", plant2: "parsley", relationship: "good", reason: "Parsley attracts beneficials; repels spider mites" },
  { plant1: "carrot", plant2: "onion", relationship: "good", reason: "Onion scent deters carrot fly; carrot scent deters onion fly" },
  { plant1: "cucumber", plant2: "nasturtium", relationship: "good", reason: "Nasturtiums trap aphids away from cucumbers" },
  { plant1: "cucumber", plant2: "dill", relationship: "good", reason: "Dill attracts predatory insects that protect cucumbers" },
  { plant1: "bean", plant2: "corn", relationship: "good", reason: "Beans fix nitrogen that feeds corn; corn provides pole support" },
  { plant1: "corn", plant2: "squash", relationship: "good", reason: "Squash shades ground preventing weeds; Three Sisters guild" },
  { plant1: "rose", plant2: "garlic", relationship: "good", reason: "Garlic deters aphids and black spot disease on roses" },
  { plant1: "broccoli", plant2: "dill", relationship: "good", reason: "Dill attracts wasps that parasitize cabbage caterpillars" },
  { plant1: "lettuce", plant2: "carrot", relationship: "good", reason: "Carrots loosen soil for lettuce roots; shade reduces lettuce bolt" },
  { plant1: "pea", plant2: "spinach", relationship: "good", reason: "Peas provide climbing structure; spinach fills ground space" },
  { plant1: "strawberry", plant2: "spinach", relationship: "good", reason: "Spinach deters pests; strawberries provide shade" },
  { plant1: "tomato", plant2: "carrot", relationship: "good", reason: "Carrots loosen soil around tomato roots" },
  { plant1: "cabbage", plant2: "chamomile", relationship: "good", reason: "Chamomile improves cabbage flavor and attracts beneficials" },
  { plant1: "cucumber", plant2: "sunflower", relationship: "good", reason: "Sunflower provides shade; attracts pollinators" },
  { plant1: "zucchini", plant2: "nasturtium", relationship: "good", reason: "Nasturtiums repel squash bugs" },
  { plant1: "pepper", plant2: "basil", relationship: "good", reason: "Basil repels aphids and spider mites from peppers" },

  // Bad companions
  { plant1: "tomato", plant2: "fennel", relationship: "bad", reason: "Fennel is allelopathic; stunts tomato growth" },
  { plant1: "onion", plant2: "pea", relationship: "bad", reason: "Onion inhibits pea germination and growth" },
  { plant1: "onion", plant2: "bean", relationship: "bad", reason: "Onion exudes chemicals that stunt bean growth" },
  { plant1: "fennel", plant2: "tomato", relationship: "bad", reason: "Fennel produces chemicals toxic to most vegetables" },
  { plant1: "fennel", plant2: "pepper", relationship: "bad", reason: "Fennel's allelochemicals inhibit pepper growth" },
  { plant1: "fennel", plant2: "carrot", relationship: "bad", reason: "Fennel and carrot cross-pollinate; keep far apart" },
  { plant1: "cabbage", plant2: "tomato", relationship: "bad", reason: "Both heavy feeders competing for nutrients" },
  { plant1: "cucumber", plant2: "sage", relationship: "bad", reason: "Sage inhibits cucumber growth" },
  { plant1: "garlic", plant2: "pea", relationship: "bad", reason: "Garlic's antimicrobial properties harm pea root bacteria" },
  { plant1: "potato", plant2: "cucumber", relationship: "bad", reason: "Both susceptible to blight; risk spreading disease" },
  { plant1: "potato", plant2: "tomato", relationship: "bad", reason: "Same family; share diseases. Keep separated" },
];

export function getCompanions(plantId: string): CompanionPair[] {
  return companionPairs.filter(
    (p) => p.plant1 === plantId || p.plant2 === plantId
  );
}

export function getGoodCompanions(plantId: string): string[] {
  return companionPairs
    .filter((p) => p.relationship === "good" && (p.plant1 === plantId || p.plant2 === plantId))
    .map((p) => (p.plant1 === plantId ? p.plant2 : p.plant1));
}

export function getBadCompanions(plantId: string): string[] {
  return companionPairs
    .filter((p) => p.relationship === "bad" && (p.plant1 === plantId || p.plant2 === plantId))
    .map((p) => (p.plant1 === plantId ? p.plant2 : p.plant1));
}
