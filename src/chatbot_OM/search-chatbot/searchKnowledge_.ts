import { extractIntent }
  from "./intentExtractor_";

import { findAsset }
  from "./findAsset";

import { vectorSearch }
  from "../vectorSearch";

import { groupBySection,
         rerankSections }
  from "./sectionRanking_";

import { loadSections }
  from "./loadSections";

export async function searchKnowledge(
  question: string
) {

/*
  //----------------------------------
  // Intent
  //----------------------------------

  const intent =
    await extractIntent(
      question
    );

  //----------------------------------
  // Asset detection
  //----------------------------------

  let assetId:
    string | undefined =
      undefined;

  if (
    intent.assetName
  ) {
    const asset =
      await findAsset(
        intent.assetName
      );

    if (
      asset &&
      asset.distance < 0.35
    ) {
      assetId =
        asset.id;
    }
  }

  //----------------------------------
  // Vector Search
  //----------------------------------

  const chunks =
    await vectorSearch({
      query:
        question,

      assetId,

      limit: 30,
    });

  //----------------------------------
  // Group sections
  //----------------------------------

  const sections =
    groupBySection(
      chunks
    );

  //----------------------------------
  // Rerank
  //----------------------------------

  const ranked =
    rerankSections(
      sections,
      intent.topic,
      assetId ?? null
    );

  //----------------------------------
  // Top sections
  //----------------------------------

  const topSectionIds =
    ranked
      .slice(0, 5)
      .map(
        x => x.sectionId
      );

  //----------------------------------
  // Load full content
  //----------------------------------

  const fullSections =
    await loadSections(
      topSectionIds
    );
*/
const intent =
  await extractIntent(
    question
  );

/* --------
let assetId:
  string | undefined =
    undefined;

if (
  intent.assetName
) {
  const asset =
    await findAsset(
      intent.assetName
    );

  if (asset) {
    assetId =
      asset.id;
  }
}
-------- */
let assetId:
  string | undefined =
    undefined;

if (
  intent.assetName
) {
  const asset =
    await findAsset(
      intent.assetName
    );

  if (asset) {

    console.log(
      "Matched asset:",
      asset.name,
      asset.score,
      asset.id
    );

    assetId =
      asset.id;
  }
}






console.log(" - Step: vectorSearch")
const chunks =
  await vectorSearch({
    query:
      question,

    assetId,

    limit: 30,
  });

console.log(" - Step: groupBySection")
const sections =
  groupBySection(
    chunks
  );

console.log("Step: rerankSections")
const ranked =
  rerankSections(
    sections,
    intent.topic
  );

console.log("Step: topSectionIds")
const topSectionIds =
  ranked
    .slice(0, 5)
    .map(
      x => x.sectionId
    );

console.log("Step: loadSections")
const fullSections =
  await loadSections(
    topSectionIds
  );

console.log("Step: end flow")











  //----------------------------------
  // Build context
  //----------------------------------

  const context =
    fullSections
      .map(
        (s) => `
SECTION:
${s.sectionPath}

CONTENT:
${s.content}
`
      )
      .join("\n\n");

  return {
    intent,

    assetId,

    context,

    sections:
      fullSections,
  };
}