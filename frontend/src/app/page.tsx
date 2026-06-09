"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, Zap, Factory, ChevronRight, Package, 
  Star, Menu, X, ArrowUpRight, ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/api'

export default function ClientLanding() {
  const [products, setProducts] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController();
    const user = localStorage.getItem('akrabiolab_user')
    setIsAdmin(!!user)

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/`, { signal: controller.signal })     
        const data = await res.json()
        if (Array.isArray(data)) setProducts(data)
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error("Error fetching products:", err)
      }
    }

    fetchProducts()

    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      controller.abort()
    }
  }, [])

  const renderProductImage = useCallback((img: string | null) => {
    if (!img) return '/images/akrabilab-logo.png';
    if (img.startsWith('http')) return img;
    return `${API_BASE_URL}${img}`;
  }, [])

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(id);
    if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        window.scrollTo({ top: (elementRect - bodyRect) - offset, behavior: 'smooth' });
    }
  }

  const [clickCount, setClickCount] = useState(0)
  
  useEffect(() => {
    if (clickCount === 3) {
      router.push('/admin-login')
      setClickCount(0)
    }
  }, [clickCount, router])

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1)
    setTimeout(() => setClickCount(0), 1500)
  }

  return (
    <main className="min-h-screen bg-[#fcfdfc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className={`flex items-center justify-between px-6 md:px-16 py-4 md:py-6 fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3 border-b border-emerald-50' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogoClick}>
          <img src="/images/akrabilab-logo.png" alt="Logo" className="h-10 md:h-12 w-auto drop-shadow-md" />    
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <span className="text-lg md:text-xl font-black tracking-tighter text-slate-800 uppercase">AKRABIOLAB</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition-all hover:scale-105">À Propos</button>
          <button onClick={() => scrollToSection('products')} className="hover:text-emerald-600 transition-all hover:scale-105">Produits</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-emerald-600 transition-all hover:scale-105">Contact</button>
        </div>

        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-900 text-white rounded-xl shadow-xl active:scale-95">
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[200] bg-white p-10 flex flex-col">
            <div className="flex justify-between items-center mb-16">
               <img src="/images/akrabilab-logo.png" alt="Logo" className="h-10" />
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-full text-slate-900"><X size={24}/></button>
            </div>
            <div className="flex flex-col gap-8 text-4xl font-black uppercase tracking-tighter">
              <button onClick={() => scrollToSection('about')} className="text-left text-slate-300 hover:text-emerald-600 transition-all">À Propos</button>
              <button onClick={() => scrollToSection('products')} className="text-left text-slate-300 hover:text-emerald-600 transition-all">Produits</button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-slate-300 hover:text-emerald-600 transition-all">Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="px-6 md:px-16 pt-32 pb-12 lg:pt-48 lg:pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#ecfdf5_0%,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6 lg:mb-8">
              <Star className="w-4 h-4 fill-emerald-700" /> Laboratoire Certifié ISO
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter uppercase">
              Pureté <br className="hidden lg:block"/> <span className="text-emerald-600">Absolue</span> <br className="hidden lg:block"/> <span className="text-orange-500">&</span> Excellence.
            </h1>
            <p className="text-base md:text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
              Leader en solutions antiseptiques et matières premières de haute pureté à Sidi Moussa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button onClick={() => scrollToSection('products')} className="px-8 py-4 lg:px-10 lg:py-5 bg-slate-900 text-white font-black rounded-xl lg:rounded-2xl hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-xl group text-sm lg:text-base">
                Découvrir nos Produits <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-xl mx-auto">
            <div className="aspect-[4/5] rounded-[2rem] lg:rounded-[4rem] overflow-hidden shadow-2xl border-4 lg:border-[1rem] border-white relative z-10 group bg-white">
               <motion.img 
                  src="/images/akrabilab-logo.png" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  alt="Akrabiolab Logo" 
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/5 to-transparent pointer-events-none" />
            </div>

            <div className="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-left-8 bg-orange-500 text-white p-5 lg:p-10 rounded-2xl lg:rounded-[3rem] shadow-xl z-20 animate-pulse">
                <p className="text-3xl lg:text-5xl font-black mb-1">99.9%</p>
                <p className="text-[7px] lg:text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Qualité Certifiée</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise */}
      <section id="about" className="px-6 md:px-16 py-16 lg:py-32 bg-slate-900 relative overflow-hidden lg:rounded-[4rem] lg:mx-8">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_50%,#065f46_0%,transparent_70%)] opacity-20"></div>
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-3 gap-12 lg:gap-20 relative z-10 text-white">
            <div className="lg:col-span-2">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-10 lg:mb-16 uppercase">
                    Expertise <br className="hidden lg:block"/> <span className="text-emerald-500 italic font-serif lowercase">Scientifique</span>.
                </h2>
                <div className="grid md:grid-cols-2 gap-10 lg:gap-14 text-left">
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-500/20"><ShieldCheck size={28} /></div>
                        <h4 className="text-xl lg:text-2xl font-black">Pureté Totale</h4>  
                        <p className="text-slate-400 text-base font-medium leading-relaxed">Conformité aux normes pharmaceutiques internationales.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center border border-orange-500/20"><Factory size={28} /></div>      
                        <h4 className="text-xl lg:text-2xl font-black">Savoir-Faire Algérien</h4>     
                        <p className="text-slate-400 text-base font-medium leading-relaxed">Laboratoire de pointe basé à Sidi Moussa, Alger.</p>
                    </div>
                </div>
            </div>
            <div className="bg-emerald-950/40 backdrop-blur-3xl p-8 lg:p-12 rounded-[2rem] lg:rounded-[3.5rem] border border-emerald-800/30 flex flex-col justify-center shadow-xl">
                <div className="space-y-6 lg:space-y-10">
                    {["Laboratoire Agréé", "Production Certifiée", "Alger - Sidi Moussa"].map((text, i) => (
                        <div key={i} className="flex items-center gap-5 group">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            <span className="text-lg lg:text-xl font-black tracking-tight">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="products" className="px-6 md:px-16 py-16 lg:py-32 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-12 lg:mb-24 gap-8 text-center lg:text-left">
            <div className="max-w-xl">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">
                    Notre <br className="hidden lg:block"/> <span className="text-emerald-600 italic font-serif lowercase">Catalogue</span>
                </h2>
                <p className="text-base md:text-xl text-slate-500 font-medium italic italic">Excellence en cosmétique & pharma.</p>
            </div>
            <div className="px-6 py-3 lg:py-4 bg-emerald-50 rounded-xl lg:rounded-2xl text-[9px] lg:text-xs font-black uppercase tracking-[0.2em] text-emerald-700 border border-emerald-100 flex items-center gap-3">
                <Package className="w-5 h-5" /> {products.length} Produits Certifiés
            </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {products.map((p: any) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="group bg-white rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-emerald-50/50 flex flex-col"
                >
                    <div className="aspect-square relative overflow-hidden bg-emerald-50/10">
                        <img src={renderProductImage(p.image)} alt={p.name} className={`w-full h-full transition-transform duration-1000 group-hover:scale-105 ${p.image ? 'object-cover' : 'object-contain p-16 opacity-20'}`} />
                        <div className="absolute top-5 left-5 lg:top-8 lg:left-8">
                            <span className="px-4 py-1.5 lg:px-6 lg:py-2.5 bg-white/95 backdrop-blur-xl rounded-full text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-emerald-700 shadow-lg border border-emerald-50">
                                Premium Quality
                            </span>
                        </div>
                    </div>
                    <div className="p-8 lg:p-10 flex-1 flex flex-col">
                        <h3 className="text-xl lg:text-2xl font-black mb-4 group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight">{p.name}</h3>
                        <p className="text-slate-500 text-xs lg:text-base font-medium leading-relaxed mb-8 line-clamp-2">{p.description}</p>
                        <div className="mt-auto flex items-center justify-between pt-6 lg:pt-8 border-t border-emerald-50">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-300 mb-1 lg:mb-2">Tarif Unitaire</span>
                                <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-700 transition-colors">{parseFloat(p.unit_price).toLocaleString()} <small className="text-[10px] lg:text-xs font-bold text-slate-400">DA</small></span>
                            </div>
                            <button className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-900 text-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-emerald-600 transition-all active:scale-90">
                                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0b1215] text-white px-6 md:px-16 py-16 lg:py-24 lg:rounded-t-[4rem] mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#065f46_0%,transparent_60%)] opacity-20"></div>
        <div className="max-w-[1300px] mx-auto grid md:grid-cols-3 gap-16 lg:gap-24 relative z-10 text-center md:text-left">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center md:justify-start gap-4">
                    <div className="p-3 bg-white rounded-xl">
                        <img src="/images/akrabilab-logo.png" alt="Logo" className="h-10 lg:h-12 w-auto" />
                    </div>
                    <span className="text-lg lg:text-xl font-black tracking-tighter uppercase">AKRABIOLAB</span>
                </div>
                <p className="text-slate-400 text-base lg:text-lg font-medium max-w-xs mx-auto md:mx-0 leading-relaxed">Définir l'excellence et la pureté industrielle.</p>
                <div className="flex items-center justify-center md:justify-start gap-5 pt-4">
                    <a href="https://www.facebook.com/Akrabiolab/" target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-emerald-600 hover:scale-110 transition-all text-white border border-white/10"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                    <a href="https://www.instagram.com/laboratoire_akrabiolab/" target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-orange-500 hover:scale-110 transition-all text-white border border-white/10"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                </div>
            </div>
            <div className="space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">Localisation</h4>
                <div className="space-y-4 text-lg lg:text-xl font-black tracking-tighter">
                    <p>Local N° 01, RDC, Sidi Moussa 16046, Alger</p>
                    <p className="text-emerald-500">0797 21 22 52</p>
                </div>
            </div>
            <div className="space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500">Disponibilité</h4>
                <div className="space-y-2">
                    <p className="text-3xl lg:text-5xl font-black tracking-tighter text-white">08:00 — 17:00</p>
                    <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px]">Dimanche au Jeudi</p>
                </div>
            </div>
        </div>
        <div className="max-w-[1300px] mx-auto mt-16 lg:mt-24 pt-10 border-t border-white/5 text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 text-center">
            © 2026 Akrabiolab. Pureté Certifiée.
        </div>
      </footer>
    </main>
  )
}
