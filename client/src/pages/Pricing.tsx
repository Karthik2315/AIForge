import React, { useState } from 'react'
import { appPlans } from '../assets/assets';

interface Plan {
  id:string;
  name:string;
  price:string;
  credits:number;
  description:string;
  features:string[];
}


const Pricing = () => {
  const [plans,setPlans] = useState<Plan[]>(appPlans);
  return (
    <>
      <div>
        
      </div>
    </>
  )
}

export default Pricing
