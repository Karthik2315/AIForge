import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, LaptopIcon, Loader2Icon, MessageSquare, SaveIcon, Smartphone, TabletIcon, XIcon } from 'lucide-react';
import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets';
import SideBar from '../components/SideBar';
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview';

const Projects = () => {
  const navigate = useNavigate();
  const {projectId} = useParams();
  const [project,setProject] = useState<Project | null>();
  const [loading,setLoading] = useState(true);
  const [isGenerating,setIsGenerating] = useState(false);
  const [device,setDevice] = useState<"phone" | "tablet" |"desktop">("desktop");
  const [isMenuOpen,setIsMenuOpen] = useState(false);
  const [isSaving,setIsSaving] = useState(false);

  const fetchProjects = async() => {
    const project = dummyProjects.find(project => project.id === projectId);
    console.log(project)
    if(project){
      setTimeout(() => {
        setProject({...project,conversation:dummyConversations,versions:dummyVersion});
        setLoading(false);
        setIsGenerating(project.current_code ? false:true);
      }, 2000);
    }
  }

  const downloadCode = () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) {
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element);
    element.click();
  }

  const togglePubish = async() => {

  }

  const saveProject = async() => {

  }
  const previewRef = useRef<ProjectPreviewRef>(null);

  useEffect(()=>{
    fetchProjects();
  },[])

  if(loading){
    return (
      <>
        <div className='flex items-center justify-center h-screen'>
          <Loader2Icon className='size-7 animate-spin text-violet-500' />
        </div>
      </>
    )
  }


  return project ?  (
    <div className='flex flex-col h-screen overflow-hidden bg-gray-900 w-full text-white'>
      <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
        {/*left*/}
        <div className='flex items-center gap-2 sm:min-w-90 text-nowrap'>
          <img src='/favicon.svg' className='h-6 cursor-pointer' onClick={()=>navigate('/')} />
          <div>
            <p className='text-sm capitalize truncate'>{project.name}</p>
            <p className='text-xs text-gray-400 -mt-0.5'>Previewing last saved version</p>
          </div>
          <div className='sm:hidden flex-1 flex justify-end'>
            {isMenuOpen ? <MessageSquare className='size-6 cursor-pointer' onClick={()=> setIsMenuOpen(false)} />
            : <XIcon className='size-6 cursor-pointer' onClick={() => setIsMenuOpen(true)} />}
          </div>  
        </div>
        {/*middle*/}
        <div className='hidden sm:flex gap-2'>
          <Smartphone className={`size-6 p-1 border rounded-full cursor-pointer ${device === "phone" && "bg-gray-700"}`} onClick={() => setDevice("phone")}/>
          <TabletIcon className={`size-6 p-1 border rounded-full cursor-pointer ${device === "tablet" && "bg-gray-700"}`} onClick={() => setDevice("tablet")}/>
          <LaptopIcon className={`size-6 p-1 border rounded-full cursor-pointer ${device === "desktop" && "bg-gray-700"}`} onClick={() => setDevice("desktop")}/>
        </div>
        {/*right*/}
        <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm'>
          <button disabled={isSaving} onClick={saveProject} className='max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 border rounded hover:scale-105 duration-300 active:scale-95 transition-all border-gray-700 cursor-pointer'>
            {isSaving ? <Loader2Icon className='size-4 animate-spin' /> : <SaveIcon className='size-4' />}Save</button>
          <Link to={`/preview/${projectId}`} target='_blank' className='flex items-center gap-1 px-4 py-1 border rounded bg-gray-800 hover:bg-gray-700 border-gray-700 hover:scale-105 duration-300 active:scale-95 transition-all cursor-pointer'>Preview</Link>
          <button onClick={downloadCode} className='flex items-center gap-2 border rounded bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 border-gray-700 cursor-pointer hover:scale-105 duration-300 active:scale-95 transition-all' disabled={isGenerating}><ArrowBigDownDashIcon className='size-4'/>Download</button>
          <button onClick={togglePubish} className='flex items-center gap-2 border rounded bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 border-gray-700 cursor-pointer hover:scale-105 duration-300 active:scale-95 transition-all'>{project.isPublished ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4'/>}
            {project.isPublished ? "Unpublish" : "Publicsh"}
          </button>
        </div>
      </div>
      {/* otherThan navbar */}
      <div className='flex flex-1 overflow-hidden gap-1'>
        <SideBar isMenuOpen={isMenuOpen} project={project} setProject={setProject} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
        <div className='flex-1 p-2 pl-0'>
          <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <p className='text-2xl font-medium text-gray-200'>Unable to load project!</p>
    </div>
  )
}

export default Projects
