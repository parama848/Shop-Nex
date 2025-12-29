import React from 'react'

const NewsLetterBox = () => {

  const onSubmitHandler=(event)=>{
    event.preventDefault();
  }

  return (
    <div className='text-center '>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus soluta illo consequuntur autem libero fugiat id, asperiores iure saepe molestiae aliquid eos voluptates necessitatibus reiciendis dolorem explicabo est totam voluptatibus?</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gre pl-3'>
        <input name='email' type="email"  placeholder='Enter your email' className='w-full sm:flex-1 outline-none  ' />
        <button type='submit' className='bg-black  text-white px-10 py-4 border border-black'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetterBox
