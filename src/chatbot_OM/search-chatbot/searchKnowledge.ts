import {
  extractIntent,
} from "./intentExtractor";

import {
  vectorSearch,
} from "../vectorSearch";

import {
  groupBySection,
  rerankSections,
} from "./sectionRanking";

import {
  loadSections,
} from "./loadSections";

export async function searchKnowledge(
  question: string,
  assetId?: string
) {
  //----------------------------------
  // Intent
  //----------------------------------

  const intent =
    await extractIntent(
      question
    );

  //----------------------------------
  // Vector Search
  //----------------------------------

  const chunks =
    await vectorSearch({
      query: question,

      assetId,

      limit: 30,
    });

  //----------------------------------
  // Group Section
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
      intent.topic
    );

  //----------------------------------
  // Top section
  //----------------------------------

  const topSectionIds =
    ranked
      .slice(0, 3)
      .map(
        (x) =>
          x.sectionId
      );

  //----------------------------------
  // Load full sections
  //----------------------------------

  const fullSections =
    await loadSections(
      topSectionIds
    );

  //----------------------------------
  // Context
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
    topic:
      intent.topic,

    rankedSections:
      ranked.slice(
        0,
        10
      ),

    context,
  };
}