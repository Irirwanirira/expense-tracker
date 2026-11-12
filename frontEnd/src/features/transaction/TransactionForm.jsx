import { useForm } from 'react-hook-form';
import styled from 'styled-components';

function TransactionForm({ handleTransaction, categories }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      option: 'EXPENSE',
      method: 'Credit Card',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const submit = (data) => {
    handleTransaction({
      ...data,
      price: parseFloat(data.price),
    });
    reset();
  };

  const selectedOption = watch('option');

  return (
    <FormContainer>
      <FormHeader>
        <Title>Add Transaction</Title>
        <Subtitle>Record your income or expense</Subtitle>
      </FormHeader>

      <StyledForm onSubmit={handleSubmit(submit)}>
        <FormGroup>
          <Label htmlFor="name">Transaction Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Please enter transaction name' })}
            placeholder="e.g., Grocery shopping, Salary"
            type="text"
          />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="option">Type *</Label>
          <Select id="option" {...register('option', { required: 'Please select type' })}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          {errors.option && <ErrorText>{errors.option.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Select id="category" {...register('category')}>
            <option value="">Select a category</option>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">Amount *</Label>
          <Input
            id="price"
            {...register('price', {
              required: 'Please enter amount',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
          />
          {errors.price && <ErrorText>{errors.price.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="method">Payment Method *</Label>
          <Select
            id="method"
            {...register('method', { required: 'Please select payment method' })}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Digital Wallet">Digital Wallet</option>
          </Select>
          {errors.method && <ErrorText>{errors.method.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            {...register('date', { required: 'Please select date' })}
            type="date"
          />
          {errors.date && <ErrorText>{errors.date.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            {...register('description')}
            placeholder="Add any notes about this transaction (optional)"
            rows="3"
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </SubmitButton>
      </StyledForm>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'nunito', sans-serif;
`;

const FormHeader = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #c9303f;
  padding-bottom: 1rem;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.4rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'nunito', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #c9303f;
    box-shadow: 0 0 0 3px rgba(201, 48, 63, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'nunito', sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #c9303f;
    box-shadow: 0 0 0 3px rgba(201, 48, 63, 0.1);
  }

  option {
    padding: 0.5rem;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'nunito', sans-serif;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #c9303f;
    box-shadow: 0 0 0 3px rgba(201, 48, 63, 0.1);
  }
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
  font-family: 'nunito', sans-serif;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(201, 48, 63, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: #c9303f;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

export default TransactionForm;
