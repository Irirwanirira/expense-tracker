import React from 'react'
import Transaction from './Transaction'

function Alltransaction({transactions}) {
  return (
    <div>
        {
            transactions.length === 0 ? (
                <h3>Empty history</h3>
            ) : (
                <>
                {
                    transactions.map((t) => (
                        <Transaction key={t._id} transaction={t} />
                    ))
                }
                </>
            )
        }
    </div>
  )
}

export default Alltransaction