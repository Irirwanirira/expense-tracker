import React from 'react'
import styled from 'styled-components'

function Movement() {
  return (
    <Container>
      <p>Transfer History</p>
      <div className='single-transaction'>
        <div>
          <p>item</p>
          <p>date</p>
        </div>
        <p>amount</p>
        <button>Delete</button>
      </div>
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

export default Movement;