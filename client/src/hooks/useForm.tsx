import { useState } from "react";


export const useForm = (initValue) =>{
  const [formData , setFormData] = useState(initValue);
  
  const handleChange = (e) => {
    const {name , value} = e.target
    setFormData(prevData => ({...prevData , [name]: value}))
  };

  return [formData , handleChange];
}