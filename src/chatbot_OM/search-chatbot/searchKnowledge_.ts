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







const chunks =
  await vectorSearch({
    query:
      question,

    assetId,

    limit: 30,
  });

const sections =
  groupBySection(
    chunks
  );

const ranked =
  rerankSections(
    sections,
    intent.topic
  );

const topSectionIds =
  ranked
    .slice(0, 5)
    .map(
      x => x.sectionId
    );

const fullSections =
  await loadSections(
    topSectionIds
  );













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