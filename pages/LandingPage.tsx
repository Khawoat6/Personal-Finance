import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const LandingHeader: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-2xl font-bold font-serif tracking-wider text-white">FINDEE</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
                    <a href="#" className="hover:text-white transition-colors">Products</a>
                    <a href="#" className="hover:text-white transition-colors">For Employers</a>
                    <a href="#" className="hover:text-white transition-colors">Resources</a>
                </nav>
                <div className="flex items-center gap-4">
                    <a href="#" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Log In</a>
                    <NavLink to="/dashboard" className="bg-white text-zinc-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                        Get Started <ArrowRight size={16}/>
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

const HeroSection: React.FC = () => (
    <section className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                Solve your greatest business challenges with <span className="italic">financial wellness.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-300">
                The global financial wellness benefit for every employee. Personalized, planner-backed financial tools—from budgeting to taxes to equity comp—delivered in one modern platform.
            </p>
            <a href="#" className="mt-8 inline-block bg-white text-zinc-900 px-6 py-3 rounded-md font-semibold hover:bg-zinc-200 transition-colors">
                Get a Demo
            </a>
        </div>
    </section>
);

const SimplifySection: React.FC = () => (
    <section className="py-20 md:py-32 text-center">
        <h2 className="text-5xl md:text-6xl font-serif italic">Simplify your money</h2>
        <div className="mt-12 px-6">
            <img src="https://storage.googleapis.com/maker-LLM-tool-responses/origin-app-simplify.png" alt="FINDEE App on phone" className="max-w-4xl mx-auto"/>
        </div>
    </section>
);

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { text: "My financial planner is absolutely incredible. I really couldn't ask for a better planner and have been blown away by how high quality their services are.", author: 'EMILY KARRKAITIO', gradient: 'from-green-400/30 to-green-600/30' },
        { text: "The platform is super user friendly, easy to navigate and understand.", author: 'KATE COLYER', gradient: 'from-cyan-400/30 to-cyan-600/30' },
        { text: "All my accounts can connect and everything is accurate and up to date. I love being able to add my partner and work together.", author: 'ALEX C.', gradient: 'from-blue-400/30 to-blue-600/30' },
    ];
    
    return (
        <section className="py-20 md:py-28">
            <h2 className="text-4xl md:text-5xl font-serif italic text-center mb-16">Read what people say</h2>
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                    <div key={i} className={`p-8 rounded-2xl bg-gradient-to-br ${t.gradient} border border-white/10 flex flex-col justify-between`}>
                        <div>
                            <div className="flex text-yellow-300 mb-4">{'★'.repeat(5)}</div>
                            <p className="text-lg text-zinc-200">{t.text}</p>
                        </div>
                        <p className="mt-8 text-sm font-semibold tracking-wider uppercase text-zinc-400">{t.author}</p>
                    </div>
                ))}
            </div>
             <div className="flex justify-center mt-12 gap-4">
                <button className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"><ChevronLeft size={20} /></button>
                <button className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"><ChevronRight size={20} /></button>
            </div>
        </section>
    );
};

const LandingFooter: React.FC = () => (
    <footer className="bg-black py-16 text-zinc-400">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="col-span-1 md:col-span-2">
                <h3 className="font-semibold text-white">The Gist</h3>
                <p className="mt-4 text-sm">Sign up for our newsletter to get actionable insights about your next money moves, right to your inbox.</p>
                <div className="mt-6 flex">
                    <input type="email" placeholder="Enter your email" className="bg-zinc-800 border border-zinc-700 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <button className="bg-zinc-700 px-4 rounded-r-md hover:bg-zinc-600"><ArrowRight size={20} /></button>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-white">Products</h3>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><a href="#" className="hover:text-white">Investing</a></li>
                    <li><a href="#" className="hover:text-white">Spending</a></li>
                    <li><a href="#" className="hover:text-white">Forecasting</a></li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-white">For Employers</h3>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><a href="#" className="hover:text-white">Get a demo</a></li>
                    <li><a href="#" className="hover:text-white">Employers</a></li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-white">Resources</h3>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><a href="#" className="hover:text-white">Company</a></li>
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Legal</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-6 mt-16 border-t border-zinc-800 pt-8">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center">
                    <span className="text-2xl font-bold font-serif tracking-wider text-white">FINDEE</span>
                </div>
                <p className="text-xs text-zinc-500 text-center">© 2024 FINDEE, Inc.</p>
            </div>
        </div>
    </footer>
);

export const LandingPage: React.FC = () => {
     useEffect(() => {
        // Set body background for the landing page
        document.body.className = 'bg-zinc-900 text-white';
    }, []);

    return (
        <div className="bg-zinc-900 font-sans">
            <LandingHeader />
            <main>
                <HeroSection />
                <SimplifySection />
                <TestimonialsSection />
            </main>
            <LandingFooter />
        </div>
    );
};