import React from 'react'
import styled from 'styled-components'

import { useDispatch } from 'react-redux'
import { deleteTransactions } from './transactionSlice'


function Transaction({transaction}) {


    const dispatch = useDispatch()
  return (
    <Container>
        {transaction && (
        <div>
            <div className='single-transaction'>
            <div>
                <p>{transaction.name}</p>
                <p>{transaction.date}</p>
            </div>
            <div>
            <p>{transaction.price}</p>
            <p>{transaction.method}</p>
            <p>{transaction.category}</p>

            </div>
          
            <button onClick={()=>dispatch(deleteTransactions(transaction._id))} >Delete</button>
            </div>
        </div>
)}
    </Container>
  )
}

const Container = styled.div `
  .single-transaction{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

export default Transaction