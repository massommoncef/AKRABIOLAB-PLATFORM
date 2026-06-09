"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { 
  ShieldCheck, Zap, Factory, ChevronRight, Package, 
  Star, Menu, X, ArrowUpRight, ArrowRight, Sparkles, Droplets, FlaskConical, Globe, Microscope
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/api'

export default function ClientLanding() {
  const [products, setProducts] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const scrollVelocity = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

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
    <main ref={containerRef} className="relative min-h-screen bg-[#05080a] text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden no-scrollbar">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#064e3b_0%,transparent_70%)] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#064e3b_0%,transparent_50%)] opacity-20"></div>
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
        />
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-emerald-500 z-[200] origin-left"
        style={{ scaleX: scrollVelocity }}
      />

      {/* Modern Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-700 px-6 md:px-12 py-6 ${isScrolled ? 'py-4' : 'py-8'}`}>
        <div className={`max-w-[1400px] mx-auto flex items-center justify-between transition-all duration-500 ${isScrolled ? 'bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 shadow-2xl' : ''}`}>
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <img src="/images/akrabilab-logo.png" alt="Logo" className="relative h-10 md:h-12 w-auto bg-white rounded-full p-1 shadow-inner" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">AKRABIOLAB</span>
            </motion.div>

            <div className="hidden lg:flex items-center gap-10">
                {['about', 'products', 'contact'].map((item) => (
                    <button key={item} onClick={() => scrollToSection(item)} className="relative text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors group">
                        {item === 'about' ? 'Héritage' : item === 'products' ? 'Solutions' : 'Alliance'}
                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-500 group-hover:w-full"></span>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/admin-login')} className="hidden sm:flex px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest transition-all">Accès Pro</button>
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-emerald-500 text-black rounded-full shadow-lg">
                    <Menu size={20} />
                </button>
            </div>
        </div>
      </nav>

      {/* Hero Section - The "Hook" */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 pt-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "circOut" }}
                >
                    <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                        Future-Ready Laboratory
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter uppercase mb-8">
                        L'ART DE LA <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-orange-400 animate-gradient-x">PURETÉ.</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-xl mb-12 leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                        "Fusionner la science et l'excellence pour redéfinir les standards industriels de demain."
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollToSection('products')}
                            className="px-10 py-5 bg-emerald-500 text-black font-black rounded-full flex items-center gap-4 group shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all"
                        >
                            DÉCOUVRIR L'EXCELLENCE <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                        <button onClick={() => scrollToSection('about')} className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-black flex items-center gap-4 transition-all">NOTRE HISTOIRE</button>
                    </div>
                </motion.div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.5, ease: "backOut" }}
                    className="relative w-full max-w-md aspect-square"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                    <div className="relative z-10 w-full h-full bg-black/40 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-12 overflow-hidden group shadow-2xl">
                        <motion.img 
                            animate={{ 
                                y: [0, -20, 0],
                                rotate: [0, 2, 0]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            src="/images/akrabilab-logo.png" 
                            className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] mix-blend-screen brightness-125" 
                            alt="Visual" 
                        />
                    </div>
                    {/* Floating Stats */}
                    <motion.div 
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-10 -right-4 md:-top-16 md:-right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-[2rem] shadow-2xl z-20"
                    >
                        <p className="text-4xl md:text-6xl font-black text-emerald-400 mb-1">0.01<span className="text-lg">%</span></p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Tolérance Pureté</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Advanced Features Strip */}
      <section className="bg-emerald-500 py-10 overflow-hidden relative border-y-4 border-black">
        <motion.div 
            style={{ x: useTransform(scrollYProgress, [0, 1], [0, -1000]) }}
            className="flex whitespace-nowrap gap-20 text-black text-4xl md:text-6xl font-black uppercase italic tracking-tighter"
        >
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                    <span>99.9% Pureté</span>
                    <Sparkles className="fill-black" size={40} />
                    <span>ISO Certifié</span>
                    <FlaskConical className="fill-black" size={40} />
                    <span>Innovation Algérienne</span>
                    <Globe className="fill-black" size={40} />
                </div>
            ))}
        </motion.div>
      </section>

      {/* Expertise Section */}
      <section id="about" className="py-24 lg:py-48 px-6 md:px-12 relative">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-[4rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-[#0a0f12] border border-white/10 rounded-[3rem] p-4 lg:p-8 aspect-video overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1579154273821-ad99159ad997?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Lab" className="w-full h-full object-cover rounded-[2rem] opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay"></div>
                    <div className="absolute bottom-12 left-12 right-12 p-8 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10">
                        <p className="text-2xl font-black italic tracking-tighter">"Notre engagement pour la pureté ne connaît aucune limite."</p>
                    </div>
                </div>
            </div>
            
            <div className="space-y-12">
                <div>
                    <span className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6 block">Notre ADN</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                        SCIENCE. <br/>
                        <span className="text-slate-600">INNOVATION.</span> <br/>
                        RÉSULTAT.
                    </h2>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
                        Le Laboratoire Akrabiolab, situé au cœur de Sidi Moussa, est le fer de lance de la production antiseptique et chimique de haute précision en Algérie.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <FeatureCard icon={<Microscope/>} title="R&D Avancé" desc="Analyses de pointe" />
                    <FeatureCard icon={<Droplets/>} title="Pureté" desc="Standards Pharmaco" />
                </div>
            </div>
        </div>
      </section>

      {/* Catalog - Modern Grid */}
      <section id="products" className="py-24 lg:py-48 px-6 md:px-12 bg-[#080d10] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#05080a] to-transparent"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
                <div>
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">LE CATALOGUE</h2>
                    <div className="h-1 w-32 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex gap-4">
                    <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        {products.length} SOLUTIONS DISPONIBLES
                    </div>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {products.map((p, idx) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-[#0d1317] rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-emerald-500/50 hover:-translate-y-4 hover:shadow-[0_20px_80px_-20px_rgba(16,185,129,0.3)]"
                    >
                        <div className="aspect-square relative overflow-hidden">
                            <img src={renderProductImage(p.image)} alt={p.name} className={`w-full h-full transition-transform duration-1000 group-hover:scale-110 ${p.image ? 'object-cover' : 'object-contain p-20 opacity-10'}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1317] via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                            <div className="absolute top-8 left-8">
                                <span className="px-5 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-2xl">Premium</span>
                            </div>
                        </div>
                        
                        <div className="p-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 line-clamp-2 italic">{p.description}</p>
                            
                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                <div>
                                    <p className="text-[8px] font-black uppercase text-slate-600 mb-2 tracking-widest">Investissement</p>
                                    <p className="text-3xl font-black text-white">{parseFloat(p.unit_price).toLocaleString()} <span className="text-sm text-emerald-500">DA</span></p>
                                </div>
                                <motion.button 
                                    whileHover={{ rotate: 45, scale: 1.2 }}
                                    className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-xl group-hover:bg-emerald-500 transition-colors"
                                >
                                    <ArrowUpRight size={24} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Alliance / Contact Section */}
      <section id="contact" className="py-24 lg:py-48 px-6 md:px-12 bg-black relative">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
                <div className="p-12 lg:p-20 bg-gradient-to-br from-emerald-900/20 to-orange-900/10 border border-white/10 rounded-[4rem] relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 blur-[100px]"></div>
                    <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                            <h4 className="text-emerald-400 font-black uppercase tracking-[0.5em] text-xs">Siège Social</h4>
                            <p className="text-4xl md:text-5xl font-black tracking-tighter leading-none">LOCAL N° 01, RDC, SIDI MOUSSA, ALGER.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-orange-400 font-black uppercase tracking-[0.5em] text-xs">Communication</h4>
                            <p className="text-4xl md:text-6xl font-black text-white hover:text-emerald-500 transition-colors cursor-pointer tracking-tighter">0797 21 22 52</p>
                        </div>
                        <div className="flex gap-6 pt-6">
                             <SocialLink href="https://www.facebook.com/Akrabiolab/" label="Facebook" />
                             <SocialLink href="https://www.instagram.com/laboratoire_akrabiolab/" label="Instagram" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-12">
                <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] animate-pulse">PRÊT <br/> À <span className="text-transparent border-t-2 border-emerald-500 py-4 block">SCIELLER?</span></h2>
                <p className="text-2xl text-slate-500 font-medium italic">"L'alliance de votre vision et de notre science."</p>
                <motion.div 
                    whileHover={{ x: 20 }}
                    className="flex items-center gap-10 text-emerald-500 font-black text-2xl uppercase tracking-widest cursor-pointer group"
                >
                    OUVRIR UNE LIGNE <div className="h-1 flex-1 bg-emerald-500 group-hover:scale-x-110 transition-transform origin-left"></div> <ArrowRight size={40} />
                </motion.div>
            </div>
        </div>
      </section>

      {/* Footer Luxe */}
      <footer className="py-20 px-6 md:px-12 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
                <img src="/images/akrabilab-logo.png" className="h-10 grayscale brightness-200" alt="Logo" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">© 2026 Laboratoire Akrabiolab.</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">
                L'Excellence comme unique Standard.
            </div>
        </div>
      </footer>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[200] bg-[#05080a] p-10 flex flex-col justify-center items-center overflow-hidden"
          >
            <div className="absolute top-12 left-12"><img src="/images/akrabilab-logo.png" alt="Logo" className="h-10" /></div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-12 right-12 p-4 bg-white/5 rounded-full text-white"><X size={32}/></button>
            
            <div className="flex flex-col gap-12 text-center">
              {['about', 'products', 'contact'].map((item, i) => (
                <motion.button 
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(item)} 
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-700 hover:text-emerald-500 hover:italic transition-all"
                >
                    {item === 'about' ? 'Héritage' : item === 'products' ? 'Solutions' : 'Alliance'}
                </motion.button>
              ))}
            </div>

            <div className="absolute bottom-12 text-center text-slate-800 font-black text-[8px] uppercase tracking-[1em]">AKRABIOLAB EXPERTISE</div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] group hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-500">
            <div className="text-emerald-500 group-hover:text-black transition-colors mb-6">{React.cloneElement(icon, { size: 32 })}</div>
            <h4 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-black transition-colors">{title}</h4>
            <p className="text-slate-500 group-hover:text-black/70 text-sm font-bold transition-colors">{desc}</p>
        </div>
    )
}

function SocialLink({ href, label }: { href: string, label: string }) {
    return (
        <a href={href} target="_blank" className="relative text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors group">
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-500"></span>
        </a>
    )
}
