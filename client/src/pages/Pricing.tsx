import React, { useState } from 'react'
import { appPlans } from '../assets/assets';
import { Check } from 'lucide-react';
import Footer from '../components/Footer';

interface Plan {
  id:string;
  name:string;
  price:string;
  credits:number;
  description:string;
  features:string[];
}

const Pricing = () => {
  const [plans] = useState<Plan[]>(appPlans);
  const handlePurchase = async(id:string) => {

  }
  return (
    <>
      <div className='w-full max-w-5xl mx-auto mt-15 min-h-[80vh]'>
        <div className='flex flex-col items-center gap-1 max-w-[380px] mx-auto text-center'>
          <h1 className='text-white font-semibold text-[32px]'>Choose Your Plan</h1>
          <p className='text-gray-400 text-[15px] '>Start for free and scale up as you grow. Find the perfect plan for your web creation needed</p>
        </div>
        <div className='flex gap-2 mt-15'>
          {plans.map((plan,index)=>(
            <div key={index} className='flex flex-col gap-2 pl-6 pb-8 pt-8 justify-between border-2 border-gray-700 bg-black/50 w-[500px] rounded-lg cursor-pointer hover:border-indigo-500'>
              <h3 className='text-white text-2xl font-semibold'>{plan.name}</h3>
              <p className='flex gap-1 text-xl text-gray-400 items-end'><h1 className='text-white font-bold text-4xl'>{plan.price}</h1>/{plan.credits} credits</p>
              <p className='text-gray-400'>{plan.description}</p>
              {plan.features.map((feature)=>(
                <div className='flex items-center gap-3 text-[13px] text-gray-400'>
                  <Check className='size-4 text-blue-500'/>
                  {feature}
                </div>
              ))}
              <button onClick={()=>handlePurchase(plan.id)} className='relative group overflow-hidden text-white px-5 py-2 mt-5 mr-5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300'>
                <span className='absolute inset-0 bg-white opacity-30 rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] blur-sm transition-transform duration-300'></span><span className='relative z-10'>Buy Now</span>
              </button>
            </div>
          ))}
        </div>
        <p className='text-gray-400 mx-auto mt-8 pl-35'>Project <span className='text-white'>Creation/Revision</span> consume <span className='text-white'>5 Credits</span>. You can purchase more credits to create more projects.</p>
      </div>
      <Footer />
    </>
  )
}

export default Pricing
