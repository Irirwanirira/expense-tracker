import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

function CategoryForm({ submitCategory }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    submitCategory(data);
    reset();
  };

  return (
    <FormContainer>
      <div>
        <p style={{color:"#fff", fontSize:"1.2rem"}}>Add Category</p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <input
          {...register('name')}
          placeholder='category'
          required
        />
        {errors.name && <p>category name is required.</p>}

        <input
          style={{margin:"2px",color: "#1a0101"}}
          className='submit'
          type='submit'
        />
      </form>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  p {
    font-weight: bold;
  }
  form {
    input {
      padding: 0.3rem;
      border: none;
      border-radius: 5px;
    }
    input:focus {
      outline: none;
    }
    .submit {
      font-weight: bold;
      background-color: #999;
      cursor: pointer;
      &:hover {
        background-color: #fff;
        color: #000;
      }
    }
  }
`;

export default CategoryForm;
