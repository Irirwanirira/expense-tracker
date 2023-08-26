import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components'
import { fetchTransactions, postTransactions } from '../transaction/transactionSlice';
import { fetchCategories, postCategory } from '../category/categoriesSlice';
import Alltransaction from '../transaction/Alltransaction';
import TransactionForm from '../transaction/TransactionForm';
import CategoryForm from '../category/CategoryForm';
import Balance from '../NavBar/Balance';
import Header from '../NavBar/Header';



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
          <div className="item1"><Header /></div>
          <div className="item2"><Balance transactions={transactions}/></div>

          <div className="item4">

                <CategoryForm submitCategory={submitCategory}/>

                <TransactionForm categories={categories} handleTransaction={handleTransaction}/>
          </div>
          <div className="item5">
            <Alltransaction transactions={transactions} />
        </div>
    
        </AppContainer>
    );
}
    
    const AppContainer = styled.div`
      background-color: #5dc3f3;
      height: 100vh;
      display: grid;
      grid-template-columns:repeat(11, 1fr);
      .item1{
        grid-column: 1/13;
        background-color: blue;
      }
      .item2{
        grid-column: 2/10;
      }
      .item3{
        grid-column: 6/10;
        background-color: green;
      }
      .item4{
        grid-column: 2/6;
        margin-right: 2rem;    
      }
      .item5{
        grid-column: 6/11;
      }
    `
    

export default LandingPage