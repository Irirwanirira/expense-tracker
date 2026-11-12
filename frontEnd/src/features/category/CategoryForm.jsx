import { useForm } from 'react-hook-form';
import styled from 'styled-components';

function CategoryForm({ submitCategory }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const submit = (data) => {
    submitCategory(data);
    reset();
  };

  return (
    <FormContainer>
      <FormHeader>
        <Title>Add Category</Title>
        <Subtitle>Create a new expense category</Subtitle>
      </FormHeader>

      <StyledForm onSubmit={handleSubmit(submit)}>
        <FormGroup>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'Category name is required',
              minLength: { value: 2, message: 'Category name must be at least 2 characters' },
            })}
            placeholder="e.g., Groceries, Entertainment, Transportation"
            type="text"
          />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Add Category'}
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

export default CategoryForm;
