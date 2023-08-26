import React from 'react';
import styled from 'styled-components';
import Transaction from './Transaction';

function Alltransaction({ transactions }) {
  return (
    <AllContainer>
      <p className='history'>Transactions History</p>

      {transactions.length === 0 ? (
        <h3 className='empty'>Empty history</h3>
      ) : (
        <div className='showTransaction'>
          {transactions.map((t) => (
            <Transaction
              key={t._id}
              transaction={t}
            />
          ))}
        </div>
      )}
    </AllContainer>
  );
}

const AllContainer = styled.div`
  .history {
    font-weight: bold;
  }
  .empty {
    color: green;
    font-size: 2rem;
  }
  .showTransaction {
    overflow-y: scroll;
    height: 20rem;
  }
`;

export default Alltransaction;
