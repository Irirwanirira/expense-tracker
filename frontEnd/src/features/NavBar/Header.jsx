import React from 'react';
import styled from 'styled-components';

function Header() {
  return (
    <HeaderWrapper>
      <h1>
        E<span>x</span>PENSE TRACKER
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
    span {
      font-size: 4rem;
      color: red;
    }
  }
`;

export default Header;
