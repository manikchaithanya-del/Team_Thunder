// HPI 1.7-G
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Pill, FlaskConical, ClipboardList, ArrowRight, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';
import { Image } from '@/components/ui/image';
import { useTheme } from '@/hooks/use-theme';

// --- Types & Interfaces ---
interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
}

interface PortalItem {
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
  color: string;
}

// --- Components ---

const SectionDivider = () => (
  <div className="w-full h-px bg-medium-grey/50" />
);

const VerticalDivider = ({ className = "" }: { className?: string }) => (
  <div className={`w-px bg-medium-grey/50 h-full absolute top-0 bottom-0 ${className}`} />
);

export default function HomePage() {
  const { theme } = useTheme();
  
  // --- Canonical Data Sources ---
  const stats: StatItem[] = [
    { label: 'Active Patients', value: '247', icon: Users },
    { label: 'Pending Prescriptions', value: '18', icon: Pill },
    { label: 'Lab Tests Today', value: '32', icon: FlaskConical },
    { label: 'Completed Activities', value: '156', icon: ClipboardList },
  ];

  const portals: PortalItem[] = [
    {
      title: 'Doctor Portal',
      description: 'Submit prescription and lab test requests for patients',
      link: '/doctor-portal',
      icon: Activity,
      color: 'primary',
    },
    {
      title: 'Pharmacy Portal',
      description: 'View and manage prescription requests',
      link: '/pharmacy-portal',
      icon: Pill,
      color: 'accent-link',
    },
    {
      title: 'Lab Portal',
      description: 'View and update diagnostic test requests',
      link: '/lab-portal',
      icon: FlaskConical,
      color: 'secondary',
    },
    {
      title: 'Patient Portal',
      description: 'Access your health records and medical history',
      link: '/patient-login',
      icon: Users,
      color: 'primary',
    },
  ];

  // --- Scroll Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-paragraph selection:bg-foreground selection:text-background overflow-clip transition-colors duration-300">
      <Header />

      <main className="flex-1 flex flex-col w-full">
        
        {/* --- HERO SECTION: The Zen Foundation --- */}
        <section className="relative w-full min-h-[95vh] flex flex-col justify-center items-center overflow-hidden border-b border-medium-grey">
          {/* Background Grid Texture */}
          <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
          />

          <div className="max-w-[120rem] w-full mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">
            
            {/* Text Content */}
            <motion.div 
              style={{ y: heroY, opacity: heroOpacity }}
              className="lg:col-span-8 flex flex-col justify-center pt-20 lg:pt-0"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-accent-link rounded-full animate-pulse" />
                <span className="text-sm font-medium tracking-widest uppercase text-secondary">System Operational</span>
              </div>

              <h1 className="font-heading text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8 text-foreground">
                MED<br/>FLOW
              </h1>
              
              <p className="font-paragraph text-xl md:text-2xl text-secondary max-w-2xl leading-relaxed mb-12 border-l-2 border-accent-link pl-6">
                Real-time hospital patient workflow coordination system enabling seamless collaboration across departments.
              </p>

              <div className="flex flex-wrap gap-6">
                <Link
                  to="/patients"
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-foreground text-background font-medium text-lg tracking-wide overflow-hidden transition-all hover:bg-accent-link"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    View Patients <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                
                <Link
                  to="/doctor-portal"
                  className="group inline-flex items-center justify-center px-10 py-5 border border-medium-grey bg-transparent text-foreground font-medium text-lg tracking-wide hover:bg-light-grey transition-colors"
                >
                  Doctor Portal
                </Link>
              </div>
            </motion.div>

            {/* Hero Visual - Abstract Representation of Flow */}
            <div className="lg:col-span-4 h-full min-h-[40vh] lg:min-h-auto relative hidden lg:block">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-light-grey rounded-lg">
                    <Image 
                      src="https://static.wixstatic.com/media/98a406_0fd7491d9f3f495d82d948cdc00202de~mv2.png"
                      alt="Medical Workflow Abstract"
                      className="w-full h-full object-cover opacity-80 grayscale contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  </div>
               </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest text-secondary">Scroll</span>
            <div className="w-px h-12 bg-medium-grey overflow-hidden">
              <motion.div 
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-1/2 bg-foreground"
              />
            </div>
          </motion.div>
        </section>

        {/* --- STATS SECTION: The Data Stream --- */}
        <section className="w-full bg-background border-b border-medium-grey relative z-20">
          <div className="max-w-[120rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative p-12 group hover:bg-light-grey transition-colors duration-300 border-b md:border-b-0 border-medium-grey lg:border-r last:border-r-0"
                >
                  <div className="flex items-start justify-between mb-6">
                    <stat.icon className="w-6 h-6 text-secondary group-hover:text-accent-link transition-colors" />
                    <span className="text-xs font-mono text-secondary/50">0{index + 1}</span>
                  </div>
                  <div className="font-heading text-5xl font-bold text-foreground mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-paragraph text-sm uppercase tracking-wider text-secondary font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PORTALS SECTION: The Command Center --- */}
        <section className="w-full bg-light-grey py-32 relative overflow-hidden">
          <div className="max-w-[120rem] mx-auto px-6 md:px-12">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div className="max-w-2xl">
                <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Department Portals
                </h2>
                <p className="font-paragraph text-lg text-secondary leading-relaxed">
                  Centralized access points for clinical, pharmaceutical, and diagnostic teams. Select a module to begin.
                </p>
              </div>
              <div className="hidden md:block pb-2">
                 <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Secure Access Only</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-medium-grey border border-medium-grey">
              {portals.map((portal, index) => (
                <Link
                  key={portal.title}
                  to={portal.link}
                  className="group relative bg-background p-12 md:p-16 overflow-hidden hover:z-10 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between min-h-[240px]">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-light-grey rounded-sm group-hover:bg-background/10 transition-colors">
                        <portal.icon className="w-8 h-8 text-foreground group-hover:text-background transition-colors" />
                      </div>
                      <ArrowRight className="w-6 h-6 text-medium-grey group-hover:text-background -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>

                    <div>
                      <h3 className="font-heading text-3xl font-bold text-foreground group-hover:text-background mb-4 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="font-paragraph text-base text-secondary group-hover:text-background/80 transition-colors max-w-md">
                        {portal.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- WORKFLOW VISUALIZATION: The Process --- */}
        <section className="w-full bg-foreground text-background py-32">
          <div className="max-w-[120rem] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Sticky Title */}
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
                    System<br/>Architecture
                  </h2>
                  <p className="font-paragraph text-lg text-secondary-foreground/70 mb-12">
                    A unified digital ecosystem designed to eliminate fragmentation and reduce latency in patient care delivery.
                  </p>
                  <div className="w-full h-px bg-secondary-foreground/20 mb-8" />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-secondary-foreground/50">
                      <div className="w-2 h-2 rounded-full bg-accent-link" />
                      <span>Real-time Sync</span>
                    </div>
                    <div className="flex items-center gap-4 text-secondary-foreground/50">
                      <div className="w-2 h-2 rounded-full bg-accent-link" />
                      <span>End-to-End Encryption</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="lg:col-span-8 flex flex-col gap-24">
                {[
                  {
                    title: "Real-time Coordination",
                    desc: "Instant updates across all departments eliminate delays and manual handoffs. When a doctor prescribes, the pharmacy knows instantly.",
                    icon: Clock
                  },
                  {
                    title: "Patient-Centric Timeline",
                    desc: "Complete chronological view of all care activities for each patient. A single source of truth for the entire medical team.",
                    icon: Users
                  },
                  {
                    title: "Multi-Department Access",
                    desc: "Dedicated, role-based portals for doctors, pharmacy, and laboratory staff ensure security and workflow specificity.",
                    icon: ShieldAlert
                  }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="group border-l border-secondary-foreground/20 pl-12 py-4"
                  >
                    <feature.icon className="w-12 h-12 text-accent-link mb-8" />
                    <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 group-hover:text-accent-link transition-colors">
                      {feature.title}
                    </h3>
                    <p className="font-paragraph text-xl text-secondary-foreground/80 leading-relaxed max-w-2xl">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- VISUAL BREATHER: The Human Element --- */}
        <section className="w-full h-[80vh] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
             <Image 
               src="https://static.wixstatic.com/media/98a406_5d474da6219241f0b3de3e6478f40f2d~mv2.png?originWidth=1152&originHeight=576"
               alt="Hospital Corridor Abstract"
               className="w-full h-full object-cover grayscale opacity-40"
             />
             <div className="absolute inset-0 bg-background/80 mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
                "Efficiency is not just about speed.<br/>It's about <span className="text-accent-link">precision</span> in care."
              </h2>
              <Link 
                to="/patients"
                className="inline-flex items-center gap-2 text-lg font-medium border-b border-foreground pb-1 hover:text-accent-link hover:border-accent-link transition-colors"
              >
                Access Patient Directory <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}