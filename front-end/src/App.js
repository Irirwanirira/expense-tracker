import styled from 'styled-components'


import Header from './components/Header'; 
import Balance from './components/Balance';
import Movement from './components/Movement';

function App() {
  return (
    <AppContainer>
      <div class="item1"><Header /></div>
      <div class="item2"><Balance /></div>
      <div class="item3">Main</div>
      <div class="item4">Transaction form</div>
      <div class="item5"><Movement /></div>

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
    grid-column: 2/6;
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

export default App;
