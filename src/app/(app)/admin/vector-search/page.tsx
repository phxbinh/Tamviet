"use client";

import { useState } from "react";

interface SearchResult {
  chunkId: string;

  documentId: string;

  sectionId: string;

  assetId: string;

  title: string;

  documentType: string;

  sectionPath: string;

  content: string;

  distance: number;
}

interface KnowledgeSearchResult {
  topic: string;

  rankedSections: {
    sectionId: string;

    sectionPath: string;

    distance: number;

    finalScore: number;
  }[];

  context: string;
}

export default function VectorSearchPage() {
  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [results, setResults] =
    useState<KnowledgeSearchResult[]>([]);

  async function handleSearch() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/vector-search",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              query,
            }),
          }
        );

      const json =
        await response.json();

      if (!json.success) {
        throw new Error(
          json.error
        );
      }

      setResults(
        json.data
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Search failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Vector Search Test
      </h1>

      <div className="space-y-2">
        <textarea
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
          rows={3}
          placeholder="Ví dụ: Nguyên nhân bùn nổi Aerotank"
          className="w-full border p-3"
        />

        <button
          onClick={
            handleSearch
          }
          disabled={
            loading ||
            !query.trim()
          }
          className="border px-4 py-2"
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>
      </div>

      <div className="space-y-4">
        {results.map(
          (item) => (
            <div
              key={
                item.chunkId
              }
              className="border p-4 rounded"
            >
              <div>
                <strong>
                  Distance:
                </strong>{" "}
                {item.distance}
              </div>

              <div>
                <strong>
                  Document:
                </strong>{" "}
                {item.title}
              </div>

              <div>
                <strong>
                  Type:
                </strong>{" "}
                {
                  item.documentType
                }
              </div>

              <div>
                <strong>
                  Section:
                </strong>{" "}
                {
                  item.sectionPath
                }
              </div>

              <pre className="mt-3 whitespace-pre-wrap text-sm">
                {
                  item.content
                }
              </pre>
            </div>
          )
        )}
      </div>
    </div>
  );
}