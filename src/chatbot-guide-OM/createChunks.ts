import {
ParsedGuide,
GuideChunk,
} from "./types";

export function createGuideChunks(
guide: ParsedGuide
): GuideChunk[] {
const chunks: GuideChunk[] = [];

let index = 0;

// OVERVIEW
chunks.push({
chunkIndex: index++,

content: `

[OVERVIEW]

Title:
${guide.title}

${guide.overview}
`.trim(),

metadata: {
  section: "overview",
},

});

// PARAMETERS
for (const p of guide.parameters) {
chunks.push({
chunkIndex: index++,

  content: `

[PARAMETER]

Parameter:
${p.parameterName}

Range:
${p.rangeRaw ?? ""}

Min:
${p.minValue ?? ""}

Max:
${p.maxValue ?? ""}

Unit:
${p.unit ?? ""}

Frequency:
${p.frequency ?? ""}

Description:
${p.description ?? ""}
`.trim(),

  metadata: {
    section: "parameter",
    parameterName:
      p.parameterName,
  },
});

}

// PROCEDURES
/*
for (const procedure of guide.procedures) {
chunks.push({
chunkIndex: index++,

  content: `

[SOP]

Procedure:
${procedure.title}

${procedure.description ?? ""}

${procedure.steps
.map(
(s) =>
Step ${s.order}: ${s.content}
)
.join("\n")}
`.trim(),

  metadata: {
    section: "procedure",
    title:
      procedure.title,
  },
});

}
*/
for (const procedure of guide.procedures) {
  const stepText = procedure.steps
    .sort((a, b) => a.order - b.order)
    .map(
      (step) =>
        `Step ${step.order}: ${step.content}`
    )
    .join("\n");

  chunks.push({
    chunkIndex: chunkIndex++,

    content: [
      "[SOP]",
      "",
      `Procedure: ${procedure.title}`,
      "",
      procedure.description ?? "",
      "",
      stepText,
    ].join("\n"),

    metadata: {
      section: "procedure",
      title: procedure.title,
    },
  });
}




// HEALTH CHECKS
for (const health of guide.healthChecks) {
chunks.push({
chunkIndex: index++,

  content: `

[HEALTH CHECK]

Status:
${health.statusType}

Indicator:
${health.label}

Description:
${health.value}
`.trim(),

  metadata: {
    section: "health_check",
    status:
      health.statusType,
  },
});

}

// TROUBLESHOOTING
for (const item of guide.troubleshooting) {
chunks.push({
chunkIndex: index++,

  content: `

[TROUBLESHOOTING]

Problem:
${item.problem}

Causes:
${item.causes.join("\n")}

Solutions:
${item.solutions.join("\n")}
`.trim(),

  metadata: {
    section:
      "troubleshooting",
  },
});

}

return chunks;
}