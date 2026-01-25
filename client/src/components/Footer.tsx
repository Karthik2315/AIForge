import React from 'react'

const Footer = () => {
  return (
    <div className='text-center py-4 text-gray-400 text-sm border-t border-gray-800 mt-24'>
      <p>© 2024 AIForge. All rights reserved - <span className='text-white/50 font-semibold cursor-pointer' onClick={() => window.open('https://github.com/Karthik2315', '_blank')}>@Karthik2315</span></p>
    </div>
  )
}

export default Footer
