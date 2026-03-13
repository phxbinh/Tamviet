// src/app/(app)/admin/categories/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CategoryParentSelect from "@/components/admin/CategoryParentSelect"
import { slugify } from "@/lib/utils/slugify"

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
}

export default function Page() {

  const { id } = useParams()
  const router = useRouter()

  const [form,setForm] = useState<Category | null>(null)
  const [categories,setCategories] = useState([])

  const [saving,setSaving] = useState(false)

  useEffect(()=>{

    async function load(){

      const cat = await fetch(`/api/admin/categories/${id}`)
      const catJson = await cat.json()

      const tree = await fetch(`/api/admin/categories/tree`)
      const treeJson = await tree.json()

      setForm(catJson.data)
      setCategories(treeJson.data)
    }

    load()

  },[id])

  if(!form) return <div className="p-10">Loading...</div>

  function update(field:string,value:any){

    setForm(prev=>({
      ...prev!,
      [field]:value
    }))
  }

  async function save(){

    setSaving(true)

    const res = await fetch(`/api/admin/categories/${id}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    })

    setSaving(false)

    if(!res.ok){
      alert("Update failed")
      return
    }

    router.refresh()
  }

  async function remove(){

    if(!confirm("Delete category?")) return

    await fetch(`/api/admin/categories/${id}`,{
      method:"DELETE"
    })

    router.push("/admin/categories")
  }

  return (

<div className="max-w-2xl mx-auto p-10 space-y-6">

<h1 className="text-2xl font-bold">
Edit Category
</h1>


{/* Name */}

<div className="space-y-2">

<label className="font-semibold text-sm">
Name
</label>

<input
className="w-full border rounded p-2"
value={form.name}
onChange={(e)=>{
  const name = e.target.value
  update("name",name)
  update("slug",slugify(name))
}}
/>

</div>


{/* Slug */}

<div className="space-y-2">

<label className="font-semibold text-sm">
Slug
</label>

<input
className="w-full border rounded p-2"
value={form.slug}
onChange={(e)=>update("slug",e.target.value)}
/>

</div>


{/* Parent */}

<div className="space-y-2">

<label className="font-semibold text-sm">
Parent category
</label>

<CategoryParentSelect
categories={categories}
value={form.parent_id}
currentId={form.id}
onChange={(v)=>update("parent_id",v)}
/>

</div>


{/* Order */}

<div className="space-y-2">

<label className="font-semibold text-sm">
Display order
</label>

<input
type="number"
className="w-full border rounded p-2"
value={form.display_order}
onChange={(e)=>update("display_order",Number(e.target.value))}
/>

</div>


{/* Active */}

<div className="flex items-center gap-2">

<input
type="checkbox"
checked={form.is_active}
onChange={(e)=>update("is_active",e.target.checked)}
/>

<span>Active</span>

</div>


<div className="flex gap-4 pt-6">

<button
onClick={save}
disabled={saving}
className="px-6 py-2 bg-black text-white rounded"
>
{saving ? "Saving..." : "Save"}
</button>

<button
onClick={remove}
className="px-6 py-2 bg-red-600 text-white rounded"
>
Delete
</button>

<button
onClick={()=>router.push("/admin/categories")}
className="px-6 py-2 border rounded"
>
Back
</button>

</div>

</div>
  )
}












