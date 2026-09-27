import React, { useState } from 'react'
import { motion } from "motion/react"
import { GiTwoCoins } from 'react-icons/gi'
import PricingCard from '../components/PricingCard'
import PaymentModal from '../components/PaymentModal'
import api from '../utils/axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const plan = [
    {
        title: "Free",
        price: "Free",
        coins: 150,
        button: "Claimed Coins",
        popular: false,
        disabled: true,
        features: [
            "150 Interview Coins",
            "Resume Builder",
            "Resume Scorer",
            "Roadmap Generator",
        ],
    },
    {
        title: "Starter",
        price: "199",
        coins: 300,
        button: "Buy Now",
        popular: true,
        disabled: false,
        features: [
            "300 Interview Coins",
            "Unlimited Resume Score",
            "Unlimited Roadmaps",
            "Priority AI Response",
        ],
    },
    {
        title: "Pro",
        price: "499",
        coins: 800,
        button: "Buy Now",
        popular: false,
        disabled: false,
        features: [
            "800 Interview Coins",
            "Multi-Agent AI Panel",
            "Voice Synthesis & TTS",
            "Custom Technical Roadmaps",
            "Detailed Scorecard Analytics",
        ],
    },
    {
        title: "Enterprise",
        price: "999",
        coins: 2000,
        button: "Buy Now",
        popular: false,
        disabled: false,
        features: [
            "2000 Interview Coins",
            "Unlimited Everything",
            "Real-Time Speech Evaluation",
            "Multi-Candidate Comparison",
            "24/7 Priority Support",
        ],
    },
];

function Billing({ user, setUser }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    const handleSelectPlan = (p) => {
        if (p.disabled) return;
        setSelectedPlan(p);
    };

    return (
        <div className='min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white'>
            {/* Ambient Background Light Mesh */}
            <div className='fixed top-0 left-1/3 w-[600px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-purple-600/15 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none' />

            <Navbar label="Coins & Billing" user={user} />

            <div className='mx-auto max-w-6xl px-4 py-12 relative z-10'>
                <div className='text-center mb-10'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold mb-3'>
                        <GiTwoCoins size={16} /> Interview Coins Store
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Fuel Your Interview Preparation
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                        Interview Coins power AI Resume Analysis, Custom Roadmaps, Mock Panels, and Real-time Speech Evaluations.
                    </p>
                </div>

                <div className='grid place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-12'>
                    {plan.map((p) => (
                        <PricingCard key={p.title}
                            {...p}
                            onBuy={() => handleSelectPlan(p)} />
                    ))}
                </div>

                {/* Coin Usage Breakdown Card */}
                <div className='max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-xl'>
                    <h3 className='text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2'>
                        <GiTwoCoins className='text-amber-400' size={18} /> Coin Cost Breakdown
                    </h3>
                    <div className='grid sm:grid-cols-2 gap-3'>
                        {[
                            { title: "Resume Builder", coin: "10 Coins" },
                            { title: "Resume Scorer", coin: "10 Coins" },
                            { title: "Roadmap Generator", coin: "20 Coins" },
                            { title: "AI Panel Interview", coin: "50 Coins" },
                        ].map((item) => (
                            <div key={item.title} className='flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5'>
                                <span className="text-xs font-semibold text-slate-300">{item.title}</span>
                                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">{item.coin}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedPlan && (
                <PaymentModal
                    plan={selectedPlan}
                    user={user}
                    setUser={setUser}
                    onClose={() => setSelectedPlan(null)}
                    onSuccess={() => {
                        setSelectedPlan(null);
                        navigate('/dashboard');
                    }}
                />
            )}
        </div>
    )
}

export default Billing

