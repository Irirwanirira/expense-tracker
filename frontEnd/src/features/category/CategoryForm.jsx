import React from 'react'
import {useForm} from 'react-hook-form'
import  styled  from 'styled-components';


function CategoryForm({submitCategory}) {
    const {register, handleSubmit, formState:{errors}} = useForm();

    const submit = (data)=> {
      submitCategory(data)
    }

  return (
    <FormContainer>
      <div>
        <p>Add Category</p>
      </div>
      <form onSubmit={handleSubmit(submit)} >

        <input{...register("name")} placeholder='category' required/>
        {errors.name && <p>category name is required.</p>}

        <input className='submit' type="submit" />
          
      </form>
    </FormContainer>
  )
}

const FormContainer = styled.div`
  p{
    font-weight: bold;
  }
  form{
    input{
      padding: 0.3rem;
      border: none;
    }
    .submit{
      color: white;
      font-weight: bold;
      background-color:grey;
    }
  }
`

export default CategoryForm