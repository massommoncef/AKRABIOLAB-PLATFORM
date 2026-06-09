"use client"

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Search, Package, ArrowRight, Filter, 
  ArrowDownAZ, ArrowUpNarrowWide, ArrowDownNarrowWide, Menu, X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/api'

export default function FullCatalog() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name') // name, price_asc, price_desc
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/`)     
        const data = await res.json()
        if (Array.isArray(data)) setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => parseFloat(a.unit_price) - parseFloat(b.unit_price))
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => parseFloat(b.unit_price) - parseFloat(a.unit_price))
    }

    return result
  }, [products, searchQuery, sortBy])

  const renderProductImage = useCallback((img: string | null) => {
    if (!img) return '/images/akrabilab-logo.png';
    if (img.startsWith('http')) return img;
    return `${API_BASE_URL}${img}`;
  }, [])

  const [clickCount, setClickCount] = useState(0)
  
  useEffect(() => {
    if (clickCount === 3) {
      router.push('/admin-login')
      setClickCount(0)
    }
  }, [clickCount, router])

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1)
    setTimeout(() => setClickCount(0), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4f5] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f0f4f5] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden relative">
      
      {/* Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-full h-full bg-[radial-gradient(circle_at_80%_20%,#ffedd5_0%,transparent_50%)] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-full h-full bg-[radial-gradient(circle_at_20%_80%,#dcfce7_0%,transparent_50%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-[0.05]"></div>
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-6">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
                <button onClick={() => router.push('/')} className="flex items-center gap-3 text-slate-500 hover:text-emerald-600 font-black uppercase tracking-widest text-[10px] transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> ACCUEIL
                </button>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
                    <img src="/images/akrabilab-logo.png" alt="Logo" className="h-8 md:h-10 w-auto transition-transform group-active:scale-90" />
                    <span className="text-lg font-black tracking-tighter text-slate-800 uppercase">AKRABIOLAB</span>
                </div>
            </div>
            
            <div className="flex flex-col items-center leading-none">
                <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">CATALOGUE COMPLET</span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-1">Sidi Moussa — Alger</span>
            </div>

            <div className="w-full md:w-auto flex items-center gap-4">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un produit..." 
                        className="w-full pl-12 pr-6 py-3 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 ring-emerald-500/20 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </nav>

      {/* Filters Toolbar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-10 relative z-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <Filter size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trier par :</span>
            <div className="flex gap-2">
                <SortButton active={sortBy === 'name'} onClick={() => setSortBy('name')} icon={<ArrowDownAZ size={14}/>} label="A-Z" />
                <SortButton active={sortBy === 'price_asc'} onClick={() => setSortBy('price_asc')} icon={<ArrowUpNarrowWide size={14}/>} label="Prix +" />
                <SortButton active={sortBy === 'price_desc'} onClick={() => setSortBy('price_desc')} icon={<ArrowDownNarrowWide size={14}/>} label="Prix -" />
            </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-white px-5 py-2 rounded-full border border-slate-100">
            {filteredAndSortedProducts.length} PRODUITS TROUVÉS
        </div>
      </div>

      {/* Catalog Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20 relative z-10">
        <AnimatePresence mode='popLayout'>
            {filteredAndSortedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                    {filteredAndSortedProducts.map((p, idx) => (
                        <motion.div 
                            layout
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: idx * 0.02 }}
                            className="group flex flex-col bg-white border border-slate-200 rounded-[3rem] overflow-hidden hover:border-emerald-400 hover:shadow-2xl transition-all duration-500 shadow-sm"
                        >
                            <div className="aspect-[4/5] relative bg-[#f8fafb] overflow-hidden flex items-center justify-center border-b border-slate-100">
                                <img src={renderProductImage(p.image)} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ${p.image ? '' : 'p-20 opacity-5'}`} alt={p.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="absolute bottom-8 left-8 right-8 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-700 z-10">
                                    <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white text-center">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Commander maintenant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-1 w-8 bg-emerald-500 rounded-full group-hover:w-12 transition-all duration-700"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Certification Lab</span>
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-6 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-10 line-clamp-4 italic">{p.description}</p>
                                <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Prix HT</p>
                                        <p className="text-3xl font-black text-slate-900 leading-none">{parseFloat(p.unit_price).toLocaleString()} <span className="text-xs text-emerald-600 font-black">DA</span></p>
                                    </div>
                                    <button className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl active:scale-90">
                                        <ArrowRight size={22} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center">
                    <Package size={64} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Aucun produit trouvé</h3>
                    <p className="text-slate-400 mt-2">Essayez un autre mot-clé ou modifiez vos filtres.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 px-6 md:px-12 relative z-10 bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <img src="/images/akrabilab-logo.png" className="h-10 grayscale opacity-40" alt="Logo" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">© 2026 Laboratoire Akrabiolab. Sidi Moussa.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <button className="hover:text-emerald-600 transition-colors">Politique de Qualité</button>
                <button className="hover:text-emerald-600 transition-colors">Documentation</button>
                <button className="hover:text-emerald-600 transition-colors">Mentions Légales</button>
            </div>
        </div>
      </footer>
    </main>
  )
}

function SortButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
        >
            {icon} {label}
        </button>
    )
}
