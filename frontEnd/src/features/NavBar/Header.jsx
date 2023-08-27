import React from 'react';
import styled from 'styled-components';

function Header() {
  return (
    <HeaderWrapper>
      <h1>
        E<span className='x'>x</span>PENSE <span className='track'>TRACKER</span>
      </h1>
    </HeaderWrapper>
  );
}
const HeaderWrapper = styled.div`
  h1 {
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 1.5rem;
    color: white;
    font-family:'nunito', sans-serif;
    .x {
      font-size: 4rem;
      font-style: italic;
      color: red;
      margin-right: -0.5rem;
    }
    .track{
      font-size: 2.5rem;
      font-style: italic;
    }
  }
`;

export default Header;
