
// src/components/admin/CategoryParentSelect.tsx
"use client";

interface Category {
  id: string
  name: string
  parent_id: string | null
}

interface Props {
  categories: Category[]
  value: string | null
  onChange: (id: string | null) => void
  currentId: string
}

function buildTree(
  categories: Category[],
  parent: string | null = null,
  level = 0
): any[] {

  return categories
    .filter(c => c.parent_id === parent)
    .flatMap(c => [
      { ...c, level },
      ...buildTree(categories, c.id, level + 1)
    ])
}

export default function CategoryParentSelect({
  categories,
  value,
  onChange,
  currentId
}: Props) {

  const tree = buildTree(categories)

  return (
    <select
      className="w-full border rounded p-2"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value || null)
      }
    >

      <option value="">No parent</option>

      {tree.map(c => {

        if (c.id === currentId) return null

        return (
          <option key={c.id} value={c.id}>
            {"— ".repeat(c.level)} {c.name}
          </option>
        )
      })}

    </select>
  )
}