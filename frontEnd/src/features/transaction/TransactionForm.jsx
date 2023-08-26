import React from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'

function TransactionForm({handleTransaction, categories}) {
    const {register, handleSubmit, formState:{errors}} = useForm();

    const submit = (data)=> {
      handleTransaction(data)
    }

  return (
    <FormWrapper>
      <div>
        <p>Add Transaction</p>
      </div>

      <form onSubmit={handleSubmit(submit)}>
              
          <input {...register("name")} placeholder='name' required />
          {errors.name && <p>please enter transaction name</p>}

          <select name="" id="" {...register("method")} required>
            <option>Method</option>
            <option>cash</option>
            <option>bank</option>
          </select>


          <select {...register("category")}>
          {
            categories.map((category) =>(
              <option key={category._id}  >{category.name}</option>
            ))
          }
          </select>

          <input {...register("price")} placeholder='price' type='number' required/>
          {errors.price && <p>please enter transaction price</p>}

          <select name="" id="" {...register("option")}>
            <option>Expense</option>
            <option>Income</option>
          </select>

          <input {...register("date")}
          type="date"
          required
          />
          {errors.date && <p>please enter transaction option</p>}
          
          <input className='submit' type="submit" />
      </form>
     </FormWrapper>

  )
}

const FormWrapper = styled.div `
  p{
    font-weight: bold;
  }

  form{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    input, select {
      border: none;
      padding: 0.3rem;
    }
    .submit{
      font-size: 1rem;
      font-weight: bold;
    }
  }
 
`
export default TransactionForm