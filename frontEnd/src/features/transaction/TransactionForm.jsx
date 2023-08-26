import React from 'react'
import {useForm} from 'react-hook-form'


function TransactionForm({handleTransaction, categories}) {
    const {register, handleSubmit, formState:{errors}} = useForm();

    const submit = (data)=> {
      handleTransaction(data)
      console.log(data, 'datatatata');
    }

  return (
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
        
        <input type="submit" />
     </form>

  )
}

export default TransactionForm