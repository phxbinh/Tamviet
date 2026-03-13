"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Share2, Plus, Minus } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  sizes: string[];
  materials: string[];
  colors: string[];
  images: string[];
  attributes: {
    label: string;
    value: string;
  }[];
}

const mockProduct: any = {
  name: "Monstera deliciosa",
  category: "Indoor Plant",
  price: 12.00,
  originalPrice: 25.00,
  rating: 4.9,
  reviews: 1245,
  description: "Cây Trầu Bà Lá Xẻ (Monstera) là loại cây cảnh nội thất được ưa chuộng nhờ vẻ đẹp độc đáo của những chiếc lá xẻ. Cây mang lại không gian xanh mát và sang trọng cho ngôi nhà của bạn.",
  sizes: ["Small", "Medium", "Large"],
  materials: ["Ceramic", "Plastic", "Wood", "Metal"],
  colors: ["#FFFFFF", "#4B2C20", "#064E3B", "#1E293B", "#000000"],
  images: [
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1597055181300-e3633a207519?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617173945092-1c6622e5b6f1?q=80&w=800&auto=format&fit=crop"
  ],
  attributes: [
    { label: "Plant Size", value: "10-12 Inches (25-30 cm)" },
    { label: "Light Requirements", value: "Bright, indirect sunlight" },
    { label: "Watering Needs", value: "Water every 1-2 weeks" },
    { label: "Growth Rate", value: "Moderate growth rate indoors" },
    { label: "Pot Material", value: "Ceramic pot with drainage hole" }
  ]
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("Small");
  const [selectedMaterial, setSelectedMaterial] = useState("Ceramic");
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState(mockProduct.images[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-slate-800">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 text-center">
        Home / Plants / <span className="text-slate-900 font-medium">Product Details</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-[#F3F4F6] rounded-2xl overflow-hidden border border-gray-100">
            <img 
              src={mainImg} 
              alt="Product" 
              className="w-full h-full object-contain p-8 mix-blend-multiply"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {mockProduct.images.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setMainImg(img)}
                className={`aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 ${mainImg === img ? 'border-[#064E3B]' : 'border-transparent'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400 uppercase tracking-widest mb-2">{mockProduct.category}</span>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{mockProduct.name}</h1>
            <span className="bg-green-100 text-[#064E3B] text-xs px-2 py-1 rounded-full font-medium">In Stock</span>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span className="text-sm text-gray-500">({mockProduct.reviews} Reviews)</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-[#064E3B]">${mockProduct.price.toFixed(2)}</span>
            <span className="text-xl text-gray-400 line-through">${mockProduct.originalPrice.toFixed(2)}</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {mockProduct.description}
          </p>

          {/* Options */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-3">Plant Size</label>
              <div className="flex flex-wrap gap-2">
                {mockProduct.sizes.map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${selectedSize === size ? 'bg-[#FACC15] text-slate-900 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Pot Material</label>
              <div className="flex flex-wrap gap-2">
                {mockProduct.materials.map((m: string) => (
                  <button 
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${selectedMaterial === m ? 'bg-[#FACC15] text-slate-900 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><Minus size={18}/></button>
              <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50"><Plus size={18}/></button>
            </div>
            <button className="flex-1 bg-[#064E3B] text-white py-3.5 px-8 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
              <ShoppingCart size={20}/> Add To Cart
            </button>
            <button className="bg-[#FACC15] text-slate-900 py-3.5 px-8 rounded-lg font-bold hover:bg-opacity-90 transition-all">
              Buy Now
            </button>
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-red-500">
              <Heart size={20}/>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs / Additional Info */}
      <div className="mt-12">
        <div className="flex justify-center border-b border-gray-200 mb-8">
          <button className="px-8 py-4 text-gray-400">Description</button>
          <button className="px-8 py-4 border-b-2 border-[#064E3B] text-[#064E3B] font-bold">Additional Information</button>
          <button className="px-8 py-4 text-gray-400">Review</button>
        </div>
        
        <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FACC15]">
                <th className="px-6 py-4 font-bold text-slate-900">Attribute</th>
                <th className="px-6 py-4 font-bold text-slate-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockProduct.attributes.map((attr: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-slate-700">{attr.label}</td>
                  <td className="px-6 py-4 text-gray-500">{attr.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
