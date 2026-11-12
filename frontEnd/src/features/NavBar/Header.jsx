import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../auth/authSlice';

function Header() {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <HeaderWrapper>
      <Title>
        E<span className='x'>x</span>PENSE <span className='track'>TRACKER</span>
      </Title>
      <UserSection>
        {userEmail && <UserEmail>{userEmail}</UserEmail>}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </UserSection>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  margin: 0;
  padding: 1rem 0;
  text-align: center;
  flex: 1;
  font-size: 1.5rem;
  color: white;
  font-family: 'nunito', sans-serif;

  .x {
    font-size: 4rem;
    font-style: italic;
    color: red;
    margin-right: -0.5rem;
  }

  .track {
    font-size: 2.5rem;
    font-style: italic;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
`;

const UserEmail = styled.span`
  color: white;
  font-size: 0.9rem;
  font-family: 'nunito', sans-serif;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #c9303f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'nunito', sans-serif;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: #b0262f;
    transform: translateY(-2px);
  }
`;

export default Header;
