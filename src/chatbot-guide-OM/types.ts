export interface ParsedGuide {
title: string;

category?: string;

version?: string;

overview: string;

procedures: Procedure[];

parameters: Parameter[];

healthChecks: HealthCheck[];

troubleshooting: Troubleshooting[];
}

export interface Procedure {
title: string;

description?: string;

steps: ProcedureStep[];
}

export interface ProcedureStep {
order: number;

content: string;
}

export interface Parameter {
equipment?: string;

parameterName: string;

rangeRaw?: string;

minValue?: number;

maxValue?: number;

unit?: string;

frequency?: string;

description?: string;
}

export interface HealthCheck {
statusType: “healthy” | “problem”;

label: string;

value: string;
}

export interface Troubleshooting {
problem: string;

causes: string[];

solutions: string[];
}

export interface GuideChunk {
chunkIndex: number;

content: string;

metadata: Record<string, any>;
}