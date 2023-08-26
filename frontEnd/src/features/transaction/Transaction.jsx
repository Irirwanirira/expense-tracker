import React from 'react'
import styled from 'styled-components'

import { useDispatch } from 'react-redux'
import { deleteTransactions } from './transactionSlice'


function Transaction({transaction}) {


    const dispatch = useDispatch()
  return (
    <Container>
        {transaction && (
        <div className='single'>
            <div className='single-transaction'>
              <p>{transaction.date}</p>
              <p>{transaction.category}</p>
              <p>{transaction.name}</p>
              <p>{transaction.price}</p>
              <p>{transaction.method}</p>

              <button onClick={()=>dispatch(deleteTransactions(transaction._id))} >Delete</button>
            </div>
        </div>
)}
    </Container>
  )
}

const Container = styled.div `

  .single-transaction{
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px grey;

    p{
      margin: 0.6rem 0 0.4rem 0;
    }
  }
`

export default Transaction