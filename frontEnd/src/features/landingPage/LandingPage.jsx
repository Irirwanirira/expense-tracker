import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components'
import { fetchTransactions, postTransactions } from '../transaction/transactionSlice';
import { fetchCategories, postCategory } from '../category/categoriesSlice';
import Alltransaction from '../transaction/Alltransaction';
import TransactionForm from '../transaction/TransactionForm';
import CategoryForm from '../category/CategoryForm';
import Balance from '../NavBar/Balance';



function LandingPage() {

    const transactions  = useSelector((state) => state.transactions.data);
    const categories  = useSelector((state) => state.categories.data)
    const dispatch = useDispatch();

    const submitCategory =(data)=> {
        dispatch(postCategory(data))
    }

    const handleTransaction =(data)=> {
        dispatch(postTransactions(data))
    }

    useEffect(() => {
      dispatch(fetchTransactions());
      dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <AppContainer>
          <div className="item1">Header</div>
          <div className="item2"><Balance transactions={transactions}/></div>

          <div className="item4">

                <p>Add Category</p>
                <CategoryForm submitCategory={submitCategory}/>

                <p>Add Transaction</p>
                <TransactionForm categories={categories} handleTransaction={handleTransaction}/>
          </div>
          <div className="item5">
          <p>Transfer History</p>

            <Alltransaction transactions={transactions} />
        </div>
    
        </AppContainer>
    );
}
    
    const AppContainer = styled.div`
      display: grid;
      grid-template-columns:repeat(11, 1fr) ;
      .item1{
        grid-column: 1/13;
        background-color: blue;
      }
      .item2{
        grid-column: 2/10;
        background-color: yellow;
      }
      .item3{
        grid-column: 6/10;
        background-color: green;
      }
      .item4{
        grid-column: 2/6;
        background-color: violet;
    
      }
      .item5{
        grid-column: 6/10;
      }
    `
    

export default LandingPage