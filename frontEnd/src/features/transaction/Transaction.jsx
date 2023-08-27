import React from 'react';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { deleteTransactions } from './transactionSlice';

function Transaction({ transaction }) {
  const dispatch = useDispatch();
  return (
    <Container>
      {transaction && (
        <div>
          <div className='single-transaction'>
            <p>{transaction.date}</p>
            <p>{transaction.category}</p>
            <p>{transaction.name}</p>
            <p>${transaction.price}</p>
            <p>{transaction.method}</p>
            <p className={`${transaction.option === 'Income' ? 'green-flag' : 'red-flag'}`}>{transaction.option}</p>

            <button className='delete'
              onClick={() => dispatch(deleteTransactions(transaction._id))}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .single-transaction {
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px grey;

    p {
      margin: 0.6rem 0 0.4rem 0;
      font-size: 0.8rem;
      font-weight: bold;
      color: #fff;

    }
    .green-flag{
      color: #33f333;
      font-weight: bold;
      font-style: italic;
      
    }
    .red-flag{
      font-weight: bold;
      color: #500000;
      font-style: italic;

    }
    .delete {
      background-color: red;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 0.2rem;
      font-weight: bold;
      cursor: pointer;
      margin-right: 0.1rem;
    }
  }
`;

export default Transaction;
