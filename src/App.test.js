import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders dashboard headline after sign in', async () => {
  render(<App />);

  // App now shows a login screen by default. Simulate the user opening the dashboard.
  const openBtn = screen.getByRole('button', { name: /open dashboard|sign in/i });
  await userEvent.click(openBtn);

  expect(screen.getByText(/financial overview/i)).toBeInTheDocument();
});
