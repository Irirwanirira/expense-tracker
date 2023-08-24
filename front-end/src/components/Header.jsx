import React from 'react'
import styled from'styled-components'

function Header() {
  return (
    <Wrapper>
        <p>e<span>x</span>pence Tracker</p>
    </Wrapper>
  )
}

const Wrapper = styled.div `
    text-align: center;
    
`

export default Header