import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'

function PricingCard({
    title,
    price,
    coins,
    button,
    features,
    popular,
    disabled,
    onBuy,
}) {
    return (
        <div className={`relative w-full rounded-2xl overflow-hidden border p-5 flex flex-col justify-between transition-all duration-300
        ${popular
          ? "border-purple-500/50 bg-slate-900/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(168,85,247,0.35)] lg:-translate-y-2 z-10"
          : "border-slate-800 bg-slate-950/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-slate-700"
        }`}>
            {popular && (<div className='absolute -top-12 -right-12 w-36 h-36 bg-purple-500/25 rounded-full blur-3xl pointer-events-none'/>)}

            {popular && (
                <div className='absolute right-4 top-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-lg tracking-wider uppercase z-10'>
                    Best Value
                </div>
            )}
            
            <h2 className='relative text-lg font-black text-white tracking-tight'>{title}</h2>

            <div className='relative mt-3 flex items-end gap-1.5'>
                <span className='text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight'>{price}</span>
                {price !== "Free" && (
                   <span className='pb-1 text-xs font-semibold text-slate-400'>
                     INR
                   </span>
                )}
            </div>

            <div className='relative mt-4 flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3'>
                <GiTwoCoins className="text-amber-400 shrink-0" size={18}/>
                <span className='text-sm font-extrabold text-amber-200'>
                    {coins} Interview Coins
                </span>
            </div>

            <div className='relative mt-5 space-y-2.5'>
                {features.map((f)=>(
                    <div key={f} className='flex items-center gap-2.5 text-xs font-medium text-slate-300'>
                        <FiCheck className="text-emerald-400 shrink-0" size={15} />
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <button disabled={disabled}
                onClick={onBuy}
                className={`relative mt-6 w-full rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                disabled
                    ? "cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700"
                    : popular
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-[0_4px_24px_rgba(168,85,247,0.5)] border border-white/20"
                    : "bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600"
                }`}>
                {button}
            </button>
        </div>
    )
}

export default PricingCard
