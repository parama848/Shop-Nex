import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
        
      <p className='text-gray-600'>{text1} <span className='text-red-400 font-medium'>{text2}</span></p>
      {/* Line  */}
      

      
    </div>
  )
}

export default Title
