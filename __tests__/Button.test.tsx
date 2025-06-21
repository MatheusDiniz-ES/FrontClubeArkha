import { render, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

it('calls onClick when not loading or disabled', () => {
  const handleClick = jest.fn();
  const { getByTestId } = render(
    <Button testID="btn" onClick={handleClick} loading={false} disabled={false}>
      Click
    </Button>
  );
  fireEvent.click(getByTestId('btn'));
  expect(handleClick).toHaveBeenCalled();
});

it('does not call onClick when loading is true', () => {
  const handleClick = jest.fn();
  const { getByTestId } = render(
    <Button testID="btn" onClick={handleClick} loading={true}>
      Click
    </Button>
  );
  fireEvent.click(getByTestId('btn'));
  expect(handleClick).not.toHaveBeenCalled();
});
