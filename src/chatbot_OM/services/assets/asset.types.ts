export interface CreateAssetInput {
  assetType:
    | "process"
    | "equipment"
    | "chemical"
    | "instrument"
    | "safety"
    | "maintenance";

  code?: string;

  name: string;

  description?: string;

  metadata?: Record<
    string,
    unknown
  >;
}

export interface UpdateAssetInput {
  assetType?:
    | "process"
    | "equipment"
    | "chemical"
    | "instrument"
    | "safety"
    | "maintenance";

  code?: string;

  name?: string;

  description?: string;

  metadata?: Record<
    string,
    unknown
  >;
}