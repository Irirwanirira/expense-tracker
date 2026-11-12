import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { loginUser, registerUser } from './authSlice';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error: authError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      dispatch(registerUser({ email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>
          E<span className="x">x</span>PENSE <span className="track">TRACKER</span>
        </Title>

        <TabContainer>
          <Tab
            active={isLogin}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Login
          </Tab>
          <Tab
            active={!isLogin}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Register
          </Tab>
        </TabContainer>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </InputGroup>

          {!isLogin && (
            <InputGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </InputGroup>
          )}

          {(error || authError) && <ErrorMessage>{error || authError}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </SubmitButton>
        </Form>

        <HelpText>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <LinkButton
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </LinkButton>
        </HelpText>
      </LoginBox>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  background: linear-gradient(135deg, #301847, #c9303f);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'nunito', sans-serif;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
  color: #333;

  .x {
    font-size: 2.5rem;
    font-style: italic;
    color: #c9303f;
    margin-right: -0.5rem;
  }

  .track {
    font-size: 1.5rem;
    font-style: italic;
    color: #301847;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: ${(props) => (props.active ? '#c9303f' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? '#b0262f' : '#e0e0e0')};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'nunito', sans-serif;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #c9303f;
    box-shadow: 0 0 5px rgba(201, 48, 63, 0.2);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #c9303f;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(135deg, #301847, #c9303f);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  font-family: 'nunito', sans-serif;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(201, 48, 63, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const HelpText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #c9303f;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-family: 'nunito', sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
