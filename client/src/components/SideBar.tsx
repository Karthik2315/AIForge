import React from 'react'
import type { Project } from '../types';

interface SideBarProps {
  isMenuOpen : boolean;
  project : Project;
  setProject : (project: Project) => void;
  isGenerating : boolean;
  setIsGenerating : (isGenerating: boolean) => void;
}

const SideBar = ({isMenuOpen,project,setProject,isGenerating,setIsGenerating}:SideBarProps) => {
  return (
    <div>
      
    </div>
  )
}

export default SideBar
