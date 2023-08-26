import React from 'react'
import styled from 'styled-components'

function Balance({transactions}) {



    const totalExpenses = transactions.filter((t) => t.option === 'Expense').reduce((a, b) => { return a + b.price}, 0);

    const totalIncome = transactions.filter((t) => t.option === 'Income').reduce((a, b) => { return a + b.price}, 0);

    const totalExpensesInCash = transactions.filter((t) => t.option === 'Expense' && t.method === 'cash').reduce((a, b) => { return a + b.price}, 0);
    const totalIncomeInCash = transactions.filter((t) => t.option === 'Income' && t.method === 'cash').reduce((a, b) => { return a + b.price}, 0);

    const totalExpensesAtBank = transactions.filter((t) => t.option === 'Expense' && t.method === 'bank').reduce((a, b) => { return a + b.price}, 0);
    const totalIncomeInBank = transactions.filter((t) => t.option === 'Income' && t.method === 'bank').reduce((a, b) => { return a + b.price}, 0);

   const cashInHand = transactions.filter((t) => t.method === 'bank' && t.option === 'Income').reduce((a, b) => { return a + b.price}, 0);

    const cashIncome = totalIncomeInCash - totalExpensesInCash
    const bankIncome = totalIncomeInBank -  totalExpensesAtBank
    const Balance = cashIncome + bankIncome

  return (

    <WrapperHead>

        <div>
            <p className={`${ Balance < totalExpenses } ? color-red :color-green`}>Balance: { Balance } </p>
            <p className={`${bankIncome < 0} ? color-red : 'color-green' `}>Bank: {bankIncome}</p>
            <p className={`${cashIncome < 0} ? color-red : color-green`}>Cash: {cashIncome}</p>
        </div>
        <div>
            <p>total expense: {totalExpenses}</p>
        </div>
      
    </WrapperHead>
  )
}

const WrapperHead = styled.div `
    display: flex;
    justify-content: space-between;

    .color-red{
        color:red;
    }
    .color-green{
        color: green;
    }

` 

export default Balance

