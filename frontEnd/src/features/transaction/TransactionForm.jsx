import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

function TransactionForm({ handleTransaction, categories }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    handleTransaction(data);
    reset();
  };

  return (
    <FormWrapper>
      <div>
        <p style={{color:"#fff", fontSize:"1.2rem"}}>Add Transaction</p>
      </div>

      <form onSubmit={handleSubmit(submit)}>
        <input
          {...register('name')}
          placeholder='name'
          required
        />
        {errors.name && <p>please enter transaction name</p>}

        <select {...register('category')}>
          {categories.map((category) => (
            <option key={category._id}>{category.name}</option>
          ))}
        </select>

        <input
          {...register('price')}
          placeholder='price'
          type='number'
          required
        />
        {errors.price && <p>please enter transaction price</p>}

        <select
          name=''
          id=''
          {...register('method')}
          required
        >
          <option disabled >Select Payment Method</option>
          <option>cash</option>
          <option>bank</option>
        </select>

        <select
          name=''
          id=''
          {...register('option')}
        >
          <option disabled >Select expense type</option>
          <option>Expense</option>
          <option>Income</option>
        </select>

        <input
          {...register('date')}
          type='date'
          required
        />
        {errors.date && <p>please enter transaction option</p>}

        <input
          className='submit'
          type='submit'
        />
      </form>
    </FormWrapper>
  );
}

const FormWrapper = styled.div`
  p {
    font-weight: bold;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    input,
    select {
      border: none;
      padding: 0.3rem;
      border-radius: 5px;
    }
    select:focus,
    input:focus {
      outline: none;
    }
    .submit {
      font-size: 1rem;
      color: #1a0101;
      font-weight: bold;
      cursor: pointer;
      background-color: #999;
      border-radius: 5px;
      &:hover {
        background-color: #fff;
        color: #000;}
    }
  }
`;
export default TransactionForm;
