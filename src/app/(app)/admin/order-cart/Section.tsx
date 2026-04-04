import { IssueRow } from "./IssueRow";

export function Section({
  title,
  data,
}: {
  title: string;
  data: Record<string, any[]>;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="space-y-3">
        {Object.entries(data).map(([key, items]) => (
          <IssueRow key={key} name={key} items={items} />
        ))}
      </div>
    </div>
  );
}