import React, { useEffect, useState } from 'react'
import type { Project } from '../types';
import { LucideLoader2, Plus, Trash2Icon } from 'lucide-react';
import { dummyProjects } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Community = () => {
  const [loading,setLoading] = useState(true);
  const [projects,setProjects] = useState<Project[]>([]);
  
  const navigate = useNavigate();
  const fetchProjects = async() => {
    setProjects(dummyProjects);
    setLoading(false)
  }
  useEffect(()=>{
    const temp = () => {
      fetchProjects();
    }
    temp()
  },[]);
  return (
    <>
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
          <div className='flex items-center justify-center h-[80vh]'>
            <LucideLoader2 className='size-10 animate-spin text-indigo-200' />
          </div>
        ) : projects.length > 0 ?  (
          <div className='py-10 min-h-[80vh]'>
            <div className='flex items-center justify-between px-5'>
              <h1 className='text-2xl font-medium text-white'>Published Projects</h1>
            </div>
            <div className='flex flex-wrap gap-3.5 mt-8'>
              {projects.map((project) => (
                  (
                  <Link to={`/view/${project.id}`} target='_blank' key={project.id} className='relative group w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden hover:border-indigo-800/80 transition-all duration-300 h-78'>
                    <div className='relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800'>
                      {project.current_code ? (
                        <iframe srcDoc={project.current_code} sandbox='allow-scripts allow-same-origin' style={{transform:'scale(.25)'}} className='absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left' />
                      ):(
                        <div className='flex items-center justify-center h-full text-gray-500'> No Preview</div>
                      )}
                    </div>
                    <div className='p-4 text-white bg-linear-180 from-transparent group-hover:from-indigo-950 to-transparent transition-colors'>
                      <div className='flex items-start justify-between'>
                        <h2 className='text-[13px] font-medium line-clamp-2'>{project.name}</h2>
                        <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border-gray-700 rounded-full text-white'>Website</button>
                      </div>
                      <p className='text-gray-400 mt-1 text-sm line-clamp-2'>{project.initial_prompt}</p>
                      <div className='absolute bottom-2 w-[85%] flex justify-between items-center mt-6'>
                        <span className='text-xs text-gray-500'>{new Date(project.createdAt).toLocaleDateString()}</span>
                        <div className='flex gap-1 text-white'>
                          <button className='text-[12px] px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-color flex items-center gap-2 cursor-pointer'><span className='bg-white text-black rounded-full px-1 font-semibold'>{project.user?.name?.slice(0,1)}</span>
                          {project.user?.name}</button>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[80vh]'>
            <h1 className='text-3xl font-semibold text-gray-300'>You have no projects yet!</h1>
            <button className='relative group overflow-hidden text-white px-5 py-2 mt-5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300'>
              <span className='absolute inset-0 bg-white opacity-30 rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] blur-sm transition-transform duration-300'></span><span className='relative z-10'>Create New</span>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Community
