import React from 'react'
import {useForm} from 'react-hook-form'


function CategoryForm({submitCategory}) {
    const {register, handleSubmit, formState:{errors}} = useForm();

    const submit = (data)=> {
      submitCategory(data)
    }

  return (
    <form onSubmit={handleSubmit(submit)} >

      <input{...register("name")} placeholder='category' required/>
      {errors.name && <p>category name is required.</p>}

      <input type="submit" />
        
    </form>
  )
}

export default CategoryForm