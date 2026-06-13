// 🟢Sử dụng vector-search ở folder api cho 
// ✅src/chatbot_OM/search-chatbot/*.ts
//*
"use client";

import { useState } from "react";

interface RankedSection {
  sectionId: string;
  sectionPath: string;
  distance: number;
  finalScore: number;
}

interface KnowledgeSearchResult {
  topic: string;
  rankedSections: RankedSection[];
  context: string;
}
*/
/* ------
// Có thể thay thế cho hai interface ở trên -----
export interface KnowledgeSearchResult {
  topic: string;
  rankedSections: {
    sectionId: string;
    sectionPath: string;
    distance: number;
    finalScore: number;
  }[];
  context: string;
}
*/

/*
export default function KnowledgeSearchPage_() {
  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<KnowledgeSearchResult | null>(
      null
    );

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

      setResult(json.data);
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Knowledge Search Test
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
          placeholder="Ví dụ: An toàn lao động khi vận hành bơm bể gom"
          className="w-full border rounded p-3"
        />

        <button
          onClick={
            handleSearch
          }
          disabled={
            loading ||
            !query.trim()
          }
          className="border px-4 py-2 rounded"
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>
      </div>

      {result && (
        <>
   
          <div className="border rounded p-4">
            <h2 className="font-bold text-lg mb-2">
              Intent / Topic
            </h2>

            <div>
              <strong>
                Topic:
              </strong>{" "}
              {result.topic}
            </div>
          </div>

    
          <div className="border rounded p-4">
            <h2 className="font-bold text-lg mb-4">
              Ranked Sections
            </h2>

            <div className="space-y-4">
              {result.rankedSections.map(
                (
                  section,
                  index
                ) => (
                  <div
                    key={
                      section.sectionId
                    }
                    className="border rounded p-3"
                  >
                    <div>
                      <strong>
                        Rank:
                      </strong>{" "}
                      {index + 1}
                    </div>

                    <div>
                      <strong>
                        Section:
                      </strong>{" "}
                      {
                        section.sectionPath
                      }
                    </div>

                    <div>
                      <strong>
                        Distance:
                      </strong>{" "}
                      {section.distance.toFixed(
                        4
                      )}
                    </div>

                    <div>
                      <strong>
                        Final Score:
                      </strong>{" "}
                      {section.finalScore.toFixed(
                        4
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

  
          <div className="border rounded p-4">
            <h2 className="font-bold text-lg mb-4">
              Context gửi vào LLM
            </h2>

            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded overflow-auto">
              {
                result.context
              }
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
//*/