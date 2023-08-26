import React from 'react';
import styled from 'styled-components';

function Balance({ transactions }) {
  const totalExpenses = transactions
    .filter((t) => t.option === 'Expense')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);

  const totalIncome = transactions
    .filter((t) => t.option === 'Income')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);

  const totalExpensesInCash = transactions
    .filter((t) => t.option === 'Expense' && t.method === 'cash')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);
  const totalIncomeInCash = transactions
    .filter((t) => t.option === 'Income' && t.method === 'cash')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);

  const totalExpensesAtBank = transactions
    .filter((t) => t.option === 'Expense' && t.method === 'bank')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);
  const totalIncomeInBank = transactions
    .filter((t) => t.option === 'Income' && t.method === 'bank')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);

  const cashInHand = transactions
    .filter((t) => t.method === 'bank' && t.option === 'Income')
    .reduce((a, b) => {
      return a + b.price;
    }, 0);

  const cashIncome = totalIncomeInCash - totalExpensesInCash;
  const bankIncome = totalIncomeInBank - totalExpensesAtBank;
  let Balance = cashIncome + bankIncome;

  return (
    <WrapperHead>
      <div className='wallet'>
        <p className={`${Balance < totalExpenses ? 'red-flag' : 'good-track'}`}>
          Balance:
          <span>{`${Balance < 0 ? Balance * -1 : Balance}`}</span>
        </p>
        <p className={`${bankIncome < 0 ? 'red-flag' : 'good-track'}`}>
          Bank: {bankIncome}
        </p>
        <p className={`${cashIncome < 0 ? 'red-flag' : 'good-track'}`}>
          Cash: {cashIncome}
        </p>
      </div>
      <div>
        <p className='expense'>total expense: {totalExpenses}</p>
      </div>
    </WrapperHead>
  );
}

const WrapperHead = styled.div`
  display: flex;
  justify-content: space-around;
  .wallet {
    p {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1rem;
    }
    .red-flag {
      color: red;
    }
    .good-track {
      color: green;
    }
  }
  .expense {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

export default Balance;
