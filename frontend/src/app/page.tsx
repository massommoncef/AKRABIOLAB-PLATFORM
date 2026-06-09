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
        const offset = 20;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        window.scrollTo({ top: (elementRect - bodyRect) - offset, behavior: 'smooth' });
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      
      {/* Precision Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 border-slate-100 shadow-sm' : 'bg-transparent py-8 border-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                <img src="/images/akrabilab-logo.png" alt="Logo" className="h-10 md:h-12 w-auto" />
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex flex-col leading-none">
                    <span className="text-lg md:text-xl font-black tracking-tighter text-slate-800 uppercase">AKRABIOLAB</span>
                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Laboratoire Certifié</span>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-12">
                {['about', 'products', 'contact'].map((id) => (
                    <button key={id} onClick={() => scrollToSection(id)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">
                        {id === 'about' ? 'Innovation' : id === 'products' ? 'Solutions' : 'Partenariat'}
                    </button>
                ))}
                <button onClick={() => router.push('/admin-login')} className="px-6 py-2 border-2 border-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Espace Client</button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Menu size={20} className="text-slate-900" />
            </button>
        </div>
      </nav>

      {/* Hero: Scientific Authority */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 md:px-12 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 skew-x-12 translate-x-20 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 text-emerald-600 mb-8">
                    <div className="h-0.5 w-12 bg-emerald-600"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sidi Moussa — Alger</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-10">
                    L'EXCELLENCE <br/> 
                    <span className="text-emerald-600">SCIENTIFIQUE</span> <br/>
                    AU SERVICE DU MARCHÉ.
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mb-12 leading-relaxed">
                    Le Laboratoire Akrabiolab déploie des protocoles de fabrication de pointe pour fournir des solutions antiseptiques et des matières premières d'une pureté absolue.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => scrollToSection('products')} className="px-10 py-5 bg-emerald-600 text-white font-black rounded-xl flex items-center gap-4 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
                        VOIR NOS SOLUTIONS <ChevronRight size={18}/>
                    </button>
                    <button onClick={() => scrollToSection('about')} className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-xl hover:bg-slate-50 transition-all">NOTRE EXPERTISE</button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative group">
                <div className="aspect-square bg-slate-50 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex items-center justify-center border border-slate-100 shadow-inner">
                    <img src="/images/akrabilab-logo.png" className="w-full max-w-xs h-auto filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Laboratory" />
                    <div className="absolute inset-0 border-[2rem] border-white rounded-[3rem]"></div>
                </div>
                
                {/* Micro-Data Cards */}
                <div className="absolute -top-8 -right-4 md:-top-12 md:-right-8 bg-white p-6 rounded-2xl shadow-2xl border border-emerald-50 flex items-center gap-5">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Activity size={24}/></div>
                    <div>
                        <p className="text-2xl font-black text-slate-900 leading-none">99.9%</p>
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">Conformité Pureté</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Structured Values */}
      <section id="about" className="py-20 lg:py-40 px-6 md:px-12 bg-slate-50/50">
        <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
                <div className="lg:col-span-1">
                    <span className="text-emerald-600 font-black uppercase tracking-[0.5em] text-[10px] mb-6 block">Nos Fondements</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                        UNE VISION <br/> <span className="text-slate-400">D'AVANT-GARDE</span>.
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Innovation, Rigueur et Transparence. Chaque produit sortant de nos lignes subit une batterie de tests rigoureux pour garantir une efficacité irréprochable.
                    </p>
                </div>
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                    <ValueCard icon={<Microscope/>} title="R&D Intégrée" desc="Développement de formules exclusives en interne pour une efficacité maximale." />
                    <ValueCard icon={<ShieldCheck/>} title="Normes ISO" desc="Processus de fabrication conformes aux plus hauts standards de qualité internationaux." />
                    <ValueCard icon={<Beaker/>} title="Matières Haut de Gamme" desc="Sélection rigoureuse des intrants pour des résultats d'exception." />
                    <ValueCard icon={<ClipboardCheck/>} title="Certification" desc="Laboratoire agréé et certifié, garantissant une sécurité totale pour le client final." />
                </div>
            </div>
        </div>
      </section>

      {/* Catalog: High-End Presentation */}
      <section id="products" className="py-20 lg:py-40 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 lg:mb-24 gap-8">
            <div>
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">LE CATALOGUE</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Excellence en Pharmacologie et Cosmétique</p>
            </div>
            <div className="px-6 py-3 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <Package size={16} /> {products.length} Produits Répertoriés
            </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {products.map((p, idx) => (
                <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-orange-200 hover:shadow-2xl transition-all duration-500"
                >
                    <div className="aspect-[4/5] relative bg-slate-50 overflow-hidden">
                        <img src={renderProductImage(p.image)} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ${p.image ? '' : 'p-16 opacity-10'}`} alt={p.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="absolute bottom-6 left-6 right-6 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 z-10">
                             <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-white text-center">
                                <span className="text-[8px] font-black uppercase tracking-widest text-orange-600">Pureté Akrabiolab</span>
                             </div>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-6 bg-orange-500 rounded-full"></div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Certification Lab</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-orange-600 transition-colors">{p.name}</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 line-clamp-2 italic">{p.description}</p>
                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div>
                                <p className="text-[8px] font-black uppercase text-slate-300 mb-1 tracking-widest">Prix HT</p>
                                <p className="text-2xl font-black text-slate-900">{parseFloat(p.unit_price).toLocaleString()} <span className="text-[10px] text-emerald-600">DA</span></p>
                            </div>
                            <button className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Partnership & Network */}
      <section id="contact" className="py-20 lg:py-40 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
                    OUVRIR UNE <br/> <span className="text-emerald-500">LIGNE DIRECTE</span>.
                </h2>
                <div className="space-y-12">
                    <ContactInfo label="Siège Social" value="Local N° 01, RDC, Sidi Moussa 16046, Alger" />
                    <ContactInfo label="Département Commercial" value="0797 21 22 52" />
                    <div className="flex gap-6">
                        <a href="https://www.facebook.com/Akrabiolab/" target="_blank" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-600 hover:border-emerald-600 transition-all group">
                            <span className="text-xs font-black uppercase tracking-widest">Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/laboratoire_akrabiolab/" target="_blank" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-600 hover:border-emerald-600 transition-all group">
                            <span className="text-xs font-black uppercase tracking-widest">Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-emerald-600 p-12 lg:p-20 rounded-[3rem] shadow-2xl relative group">
                <div className="absolute top-0 right-0 p-12 text-white/20"><Microscope size={120}/></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-8">Partenariat Professionnel</h3>
                <p className="text-white/80 font-medium mb-12 leading-relaxed">Devenez distributeur agréé de nos solutions antiseptiques et profitez d'une expertise reconnue sur tout le territoire national.</p>
                <button className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-black transition-all">
                    SOUMETTRE UNE DEMANDE <ArrowUpRight size={20}/>
                </button>
            </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-12 border-t border-slate-100 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
                <img src="/images/akrabilab-logo.png" className="h-8 grayscale opacity-50" alt="Logo" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">© 2026 Laboratoire Akrabiolab. Sidi Moussa.</span>
            </div>
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <button className="hover:text-emerald-600 transition-colors">Politique de Qualité</button>
                <button className="hover:text-emerald-600 transition-colors">Mentions Légales</button>
            </div>
        </div>
      </footer>

      {/* Minimal Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[200] bg-white p-10 flex flex-col">
            <div className="flex justify-between items-center mb-16">
               <img src="/images/akrabilab-logo.png" alt="Logo" className="h-10" />
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-full text-slate-900"><X size={24}/></button>
            </div>
            <div className="flex flex-col gap-10">
                {['Innovation', 'Solutions', 'Partenariat'].map((text, i) => (
                    <button key={text} onClick={() => scrollToSection(i === 0 ? 'about' : i === 1 ? 'products' : 'contact')} className="text-5xl font-black uppercase tracking-tighter text-slate-300 hover:text-emerald-600 text-left transition-colors">{text}</button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
            <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">{React.cloneElement(icon, { size: 32 })}</div>
            <h4 className="text-lg font-black uppercase tracking-tight mb-3">{title}</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
        </div>
    )
}

function ContactInfo({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-2">
            <h4 className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] opacity-60">{label}</h4>
            <p className="text-2xl md:text-3xl font-black tracking-tighter">{value}</p>
        </div>
    )
}
