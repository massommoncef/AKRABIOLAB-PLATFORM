"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, Zap, Factory, ChevronRight, Package, 
  Star, Menu, X, ArrowUpRight, ArrowRight, Microscope, Beaker, ClipboardCheck, Activity
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/api'

export default function ClientLanding() {
  const [products, setProducts] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController();
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
        const offset = 110; // height of the fixed navigation bar
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
    setTimeout(() => setClickCount(0), 2000)
  }

  return (
    <main className="min-h-screen bg-[#f1f4f5] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden relative">
      
      {/* Precision Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-full h-full bg-[radial-gradient(circle_at_80%_20%,#ffedd5_0%,transparent_50%)] opacity-100"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-full h-full bg-[radial-gradient(circle_at_20%_80%,#dcfce7_0%,transparent_50%)] opacity-90"></div>
        <div className="absolute top-[40%] left-[30%] w-[80%] h-[80%] bg-orange-100/60 blur-[200px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[60%] h-[60%] bg-emerald-100/40 blur-[180px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-[0.08]"></div>
      </div>

      {/* Precision Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4 border-slate-200 shadow-sm' : 'bg-transparent py-8 border-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={handleLogoClick}>
                <img src="/images/akrabilab-logo.png" alt="Logo" className="h-10 md:h-12 w-auto transition-transform group-active:scale-90" />
                <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
                <div className="flex flex-col leading-tight">
                    <span className="text-lg md:text-xl font-black tracking-tighter text-slate-800 uppercase">AKRABIOLAB</span>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Laboratoire Certifié</span>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-12 text-slate-600 font-black uppercase tracking-[0.2em] text-[12px]">
                <button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition-colors">Vision</button>
                <button onClick={() => scrollToSection('products')} className="hover:text-emerald-600 transition-colors">Produits</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-emerald-600 transition-colors">Contact</button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Menu size={20} className="text-slate-900" />
            </button>
        </div>
      </nav>

      {/* Hero: Scientific Authority */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-6 md:px-12 overflow-hidden border-b border-slate-200/50">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 text-emerald-600 mb-8">
                    <div className="h-0.5 w-12 bg-emerald-600"></div>
                    <span className="text-[12px] font-black uppercase tracking-[0.4em]">Laboratoire Sidi Moussa — Alger</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-slate-900 leading-[1.05] tracking-tighter uppercase mb-10">
                    L'EXCELLENCE <br/> 
                    <span className="text-emerald-600 font-serif lowercase italic">scientifique</span> <br/>
                    D'AKRABIOLAB.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium max-w-xl mb-12 leading-relaxed">
                    Protocoles de fabrication de pointe pour des solutions antiseptiques et cosmétiques d'une pureté certifiée.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => scrollToSection('products')} className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl flex items-center gap-4 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
                        NOS SOLUTIONS <ChevronRight size={18}/>
                    </button>
                    <button onClick={() => scrollToSection('about')} className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm">EXPERTISE</button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center items-center">
                <div className="w-full max-w-xl aspect-square bg-white rounded-[4rem] relative overflow-hidden flex items-center justify-center border border-slate-100 shadow-2xl transition-all duration-700 hover:shadow-emerald-100/50 group">
                    <motion.img
                        whileHover={{ scale: 1.04 }}
                        src="/images/akrabilab-logo.png"
                        className="w-full h-full object-contain p-10 md:p-14 transition-all duration-1000"
                        alt="Akrabiolab Logo"
                    />

                    {/* Atmospheric Emerald Light Leak */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                </div>

                {/* Decorative Light Leak Overlay */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200/30 blur-[120px] rounded-full animate-pulse"></div>
            </motion.div>
        </div>
      </section>

      {/* Values: Scientific Rigor */}
      <section id="about" className="scroll-mt-28 py-24 lg:py-40 px-6 md:px-12 relative border-b border-slate-200/40 bg-white/30 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="grid lg:grid-cols-3 gap-16 lg:gap-24 items-center">
                <div className="lg:col-span-1">
                    <span className="text-emerald-600 font-black uppercase tracking-[0.5em] text-[12px] mb-6 block">Vision Industrielle</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[1.1] mb-10">
                        UNE RIGUEUR <br/> <span className="text-slate-400">INÉBRANLABLE</span>.
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                        "La pureté est l'âme de notre laboratoire. Chaque goutte est le fruit d'une précision millimétrée."
                    </p>
                </div>
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-10">
                    <ValueCard icon={<Microscope/>} title="R&D Avancée" desc="Développement interne de formules chimiques de haute performance." />
                    <ValueCard icon={<ShieldCheck/>} title="Contrôle Qualité" desc="Batterie de tests rigoureux pour une conformité ISO totale." />
                    <ValueCard icon={<Beaker/>} title="Matières Pures" desc="Sélection des meilleurs intrants mondiaux pour nos produits." />
                    <ValueCard icon={<ClipboardCheck/>} title="Certification" desc="Agrément officiel garantissant une sécurité pharmaceutique." />
                </div>
            </div>
        </div>
      </section>

      {/* Catalog: Homepage Preview (Limited to 6) */}
      <section id="products" className="scroll-mt-28 py-24 lg:py-40 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-20 lg:mb-32 gap-10">
            <div className="text-center lg:text-left">
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-4">LE CATALOGUE</h2>
                <div className="h-1 w-20 bg-emerald-600 mx-auto lg:mx-0 rounded-full shadow-lg shadow-emerald-100"></div>
            </div>
            <div className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-100">
                <Package size={18} /> {products.length} SOLUTIONS CERTIFIÉES
            </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {products.slice(0, 6).map((p, idx) => (
                <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex flex-col bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[3rem] overflow-hidden hover:border-emerald-400 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-700"
                >
                    <div className="aspect-[4/5] relative bg-[#f1f4f5] overflow-hidden flex items-center justify-center border-b border-slate-100">
                        <img src={renderProductImage(p.image)} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ${p.image ? '' : 'p-20 opacity-10'}`} alt={p.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="absolute bottom-8 left-8 right-8 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-700 z-10">
                             <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white text-center">
                                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 font-bold">Qualité Supérieure</span>
                             </div>
                        </div>
                    </div>
                    <div className="p-10 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-1 w-8 bg-emerald-500 rounded-full group-hover:w-12 transition-all duration-700"></div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Certifié Lab</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-6 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                        <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-10 line-clamp-3 italic">{p.description}</p>
                        <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-black uppercase text-slate-400 mb-1 tracking-widest">Prix Unitaire HT</p>
                                <p className="text-3xl font-black text-slate-900 leading-tight">{parseFloat(p.unit_price).toLocaleString()} <span className="text-xs text-emerald-600 font-black">DA</span></p>
                            </div>
                            <button className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl active:scale-90">
                                <ArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="mt-24 text-center">
            <button 
                onClick={() => router.push('/products')}
                className="px-12 py-6 bg-slate-900 text-white font-black rounded-full hover:bg-emerald-600 transition-all shadow-2xl flex items-center gap-4 mx-auto group text-lg"
            >
                EXPLORER LE CATALOGUE COMPLET <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
        </div>
      </section>

      {/* Partnership & Network */}
      <section id="contact" className="scroll-mt-28 py-24 lg:py-48 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-12">
                    REJOINDRE <br/> <span className="text-emerald-500 font-serif lowercase italic">l'alliance</span>.
                </h2>
                <div className="space-y-10">
                    <a href="https://maps.app.goo.gl/yYvE9pQvJ7BfG6bZ7" target="_blank" className="block group">
                        <ContactInfo label="Siège Social" value="Local N° 01, RDC, Sidi Moussa 16046, Alger" />
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-3 group-hover:underline flex items-center gap-2">Voir sur Google Maps <ArrowUpRight size={14}/></span>
                    </a>

                    {/* Embedded interactive map */}
                    <a href="https://maps.app.goo.gl/yYvE9pQvJ7BfG6bZ7" target="_blank" className="block rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                        <iframe
                            title="Localisation Akrabiolab"
                            src="https://maps.google.com/maps?q=Sidi%20Moussa%2016046%20Alger&z=14&output=embed"
                            className="w-full h-56 md:h-64 grayscale-[0.2] group-hover:grayscale-0 transition-all pointer-events-none"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </a>

                    <ContactInfo label="Département Commercial" value="0797 21 22 52" />
                    <div className="flex flex-wrap gap-5 pt-2">
                        <SocialLink href="https://www.facebook.com/Akrabiolab/" label="Facebook" icon={<FacebookIcon />} />
                        <SocialLink href="https://www.instagram.com/laboratoire_akrabiolab/" label="Instagram" icon={<InstagramIcon />} />
                    </div>
                </div>

            </div>
            <div className="bg-emerald-600 p-12 lg:p-24 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(16,185,129,0.3)] relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-12 text-white/10 -rotate-12 translate-x-12 -translate-y-12 group-hover:rotate-0 transition-transform duration-1000"><Microscope size={240}/></div>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-10 relative z-10">Partenariat Professionnel</h3>
                <p className="text-emerald-50 font-medium mb-16 leading-relaxed relative z-10 text-lg">Distribuez nos solutions et profitez d'une expertise reconnue sur tout le territoire national.</p>
                <button className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-black transition-all relative z-10 text-lg shadow-2xl">
                    OUVRIR UN DOSSIER <ArrowUpRight size={24}/>
                </button>
            </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-16 border-t border-slate-200 px-6 md:px-12 relative z-10 bg-white/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <img src="/images/akrabilab-logo.png" className="h-10 grayscale opacity-40" alt="Logo" />
                <span className="text-[13px] font-black uppercase tracking-[0.4em] text-slate-400">© 2026 Laboratoire Akrabiolab. Sidi Moussa. Excellence Certifiée.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
                <button className="hover:text-emerald-600 transition-colors">Politique de Qualité</button>
                <button className="hover:text-emerald-600 transition-colors">Documentation</button>
                <button className="hover:text-emerald-600 transition-colors">Mentions Légales</button>
            </div>
        </div>
      </footer>

      {/* Minimal Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[200] bg-white p-10 flex flex-col">
            <div className="flex justify-between items-center mb-20">
               <img src="/images/akrabilab-logo.png" alt="Logo" className="h-12" />
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-slate-100 rounded-full text-slate-900"><X size={28}/></button>
            </div>
            <div className="flex flex-col gap-12">
                {['Innovation', 'Solutions', 'Partenariat'].map((text, i) => (
                    <button key={text} onClick={() => scrollToSection(i === 0 ? 'about' : i === 1 ? 'products' : 'contact')} className="text-6xl font-black uppercase tracking-tighter text-slate-300 hover:text-emerald-600 text-left transition-colors">{text}</button>
                ))}
            </div>
            <div className="mt-auto pb-10 text-center text-slate-300 font-black text-[11px] uppercase tracking-[1em]">AKRABIOLAB EXPERTISE</div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-10 bg-white/70 backdrop-blur-sm border border-white rounded-[3.5rem] hover:shadow-2xl hover:border-emerald-300 transition-all duration-500 group relative overflow-hidden shadow-sm">
            <div className="text-emerald-600 mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10">{React.cloneElement(icon, { size: 36 })}</div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10 group-hover:text-emerald-700">{title}</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">{desc}</p>
            <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-700 translate-x-4 translate-y-4">{React.cloneElement(icon, { size: 100 })}</div>
        </div>
    )
}

function ContactInfo({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-3">
            <h4 className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[13px] opacity-70">{label}</h4>
            <p className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">{value}</p>
        </div>
    )
}

function SocialLink({ href, label, icon }: { href: string, label: string, icon?: React.ReactNode }) {
    return (
        <a href={href} target="_blank" className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-600 hover:border-emerald-600 transition-all group shadow-xl">
            {icon}
            <span className="text-xs font-black uppercase tracking-[0.25em]">{label}</span>
        </a>
    )
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    )
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    )
}
