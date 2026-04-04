"use client";

import { useState } from "react";

export function IssueRow({
  name,
  items,
}: {
  name: string;
  items: any[];
}) {
  const [open, setOpen] = useState(false);
  const hasIssue = items.length > 0;

  const getStatusStyle = () => {
    if (!hasIssue)
      return "bg-green-500/10 text-green-500 border-green-500/20";

    if (name.includes("wrong") || name.includes("Mismatch"))
      return "bg-red-500/10 text-red-500 border-red-500/20";

    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  };

  return (
    <div className="border border-border rounded-xl p-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{name}</span>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded border ${getStatusStyle()}`}
          >
            {hasIssue ? `${items.length} issues` : "OK"}
          </span>

          {hasIssue && (
            <button
              onClick={() => setOpen(!open)}
              className="text-xs text-primary underline"
            >
              {open ? "Hide" : "View"}
            </button>
          )}
        </div>
      </div>

      {/* Detail */}
      {open && hasIssue && (
        <div className="mt-3 max-h-48 overflow-auto rounded-lg bg-muted p-2 text-xs">
          <pre>{JSON.stringify(items, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}