
import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers";

async function getCategories() {
  const host = (await headers()).get("host");

  const res = await fetch(`http://${host}/api/admin/categories/tree`, {
    cache: "no-store",
  });

  if(!res.ok) throw new Error("Failed categories")

  const json = await res.json()

  return json.data
}

async function getProducts(path?:string){

  const host = (await headers()).get("host");

  const url = path
    ? `http://${host}/api/products/categories?category=${path}`
    : `http://${host}/api/products/categories`

  const res = await fetch(url,{ cache:"no-store" })

  if(!res.ok) return null

  const json = await res.json()

  return json.data
}



export default async function Page({
  params
}:{
  params: Promise<{ slug?:string[] }>
}){

  const { slug } = await params

  const slugArray = slug ?? []

  const path = slugArray.join("/")

  const [products,categories] = await Promise.all([
    getProducts(path),
    getCategories()
  ])

  if(products === null){
    notFound()
  }

  return (

<div className="max-w-7xl mx-auto p-10 space-y-10">

{/* Title */}

<h1 className="text-3xl font-bold">
Products
</h1>


{/* CATEGORY TOOLBAR */}

<div className="flex flex-wrap gap-3">

<Link
href="/testCategories"
className={`px-4 py-2 border rounded ${
  !path ? "bg-black text-white":""
}`}
>
All
</Link>

{categories.map((cat:any)=>{

  return(

<Link
key={cat.id}
href={`/products/categories/${cat.category_path}`}
className={`px-4 py-2 border rounded text-sm ${
  path === cat.category_path
  ? "bg-black text-white"
  : ""
}`}
>

{"—".repeat(cat.category_depth)}
{cat.name}

</Link>

)

})}

</div>


{/* PRODUCT GRID */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

{products.map((p:any)=>(

<div
key={p.id}
className="border rounded p-4 space-y-2 hover:shadow"
>

<div className="font-semibold">
{p.name}
</div>

<div className="text-sm text-gray-500">
{p.slug}
</div>

</div>

))}

</div>

</div>

  )
}