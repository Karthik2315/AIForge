import  { useEffect, useRef, useState } from 'react'
import type { Message, Project, Version } from '../types';
import { BotIcon, EyeIcon, Loader2Icon, SendIcon, User2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SideBarProps {
  isMenuOpen : boolean;
  project : Project;
  setProject : (project: Project) => void;
  isGenerating : boolean;
  setIsGenerating : (isGenerating: boolean) => void;
}

const SideBar = ({isMenuOpen,project,setProject,isGenerating,setIsGenerating}:SideBarProps) => {
  
  const messageRef = useRef<HTMLDivElement>(null);
  const [input,setInput] = useState<string>("");
  const handleRollBack = async(versionId:string) => {
    
  }

  const handleRevisions = async(e:React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  }

  useEffect(()=>{
    if(messageRef.current){
      messageRef.current.scrollIntoView({behavior:'smooth'})
    }
  },[project.conversation.length,isGenerating])
  return (
    <div className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? "max-sm:w-0 ":"w-full"}`}>
      <div className='flex flex-col h-full'>
        {/* Message Container */}
        <div className='flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4'>
          {[...project.conversation,...project.versions].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message)=>{
            const ismessage = 'content' in message;
            if(ismessage){
              const msg = message as Message;
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${!isUser ? "justify-start" : "justify-end"}`}>
                  {
                    !isUser && (
                      <div className='w-8 h-8 rounded-full flex items-center justify-center bg-linear-to-br from-indigo-600 to-indigo-800'>
                        <BotIcon className='size-4 text-white' />
                      </div>
                    )
                  }
                  <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed ${isUser ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none" : "text-gray-100 rounded-tl-none bg-gray-800"}`}>
                    {msg.content}
                  </div>
                  {
                    isUser && (
                      <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-800'>
                        <User2Icon className='size-4 text-white' />
                      </div>
                    )
                  }
                </div>
              )
            }else{
              const ver = message as Version;
              return (
                <div key={ver.id} className='w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2'>
                  <div className='text-xs font-medium'>
                    Code Updated <br/>
                    <span className='text-gray-500 text-xs font-normal'>
                      {new Date(ver.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    {
                      project.current_version_index === ver.id ? (
                        <button className='px-3 py-1 rounded-md text-xs bg-gray-700'>
                          Current version
                        </button>
                      ) : (
                        <button onClick={()=>handleRollBack(ver.id)} className='px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer hover:scale-105 focus:scale-95 transition-all duration-500'>
                          Roll back to this version 
                        </button>
                      )
                    }
                    <Link target='_blank' to={`/preview/${project.id}/${ver.id}`} >
                      <EyeIcon className='size-6 p-1 bg-gray-700 hover:bg-indigo-500 transition-colors rounded'/>
                    </Link>
                  </div>
                </div>
              )
            }
          })}
          {isGenerating && (
            <div className='flex items-start gap-3 justify-start'>
              <div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-800 flex items-center justify-center'>
                <BotIcon className='size-5 text-white' />
              </div>
              <div className='flex gap-1.5 h-full items-end'>
                <span className='size-2 rounded-full bg-gray-600 animate-bounce' style={{animationDelay: '0s'}}/>
                <span className='size-2 rounded-full bg-gray-600 animate-bounce' style={{animationDelay: '0.2s'}}/>
                <span className='size-2 rounded-full bg-gray-600 animate-bounce' style={{animationDelay: '0.4s'}}/>
              </div>
            </div>
          )}
          <div ref={messageRef} />
        </div>
        <form onSubmit={handleRevisions} className='m-3 relative'>
          <div className='flex items-center gap-2 pb-5'>
            <textarea onChange={(e)=>setInput(e.target.value)} value={input} placeholder='Describe your website on requesting changes' className='flex-1 p-3 rounded-xl resize-none text-sm outline-none ring-2 ring-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-100 placeholder-gray-400 transition-all' rows={4} disabled={isGenerating}/>
            <button className='absolute bottom-7 right-2 p-2 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center cursor-pointer hover:scale-105 focus:scale-95 transition-all duration-500' disabled={isGenerating || !input.trim()} type='submit'>
              {isGenerating ? (
                <Loader2Icon className='size-6 animate-spin text-white' />
              ) : (
                <SendIcon className='size-6 text-white'/>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) 
}

export default SideBar
