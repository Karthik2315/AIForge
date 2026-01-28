import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

const Home = () => {
  const [input,setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const onSubmitHandler = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  return (
<>
      <section className="flex flex-col items-center text-white mt-20 text-sm pb-20 px-4 font-poppins">
        <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
          Turn thoughts into websites instantly, with AI.
        </h1>

        <p className="text-center text-base max-w-md mt-2">
          Create, customize and publish website faster than ever with our AI Site Builder
        </p>

        <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all">
          <textarea onChange={e => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />
          <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300">
            {loading ? <>
              Creating <Loader2 className='size-4 animate-spin text-white'/>
            </> : "Create with AI"}
          </button>
        </form>
      </section>
    </>
  )
}

export default Home
