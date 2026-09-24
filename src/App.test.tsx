// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import App from './App';

// The starter currently owns this local interaction; move these tests with it
// when extracting a feature. Do not assert the surrounding layout.
test('submits the entered name without a native runtime', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByRole('textbox', { name: 'Name' }), '  Alice  ');
  await user.click(screen.getByRole('button', { name: 'Greet' }));
  expect(screen.getByRole('status')).toHaveTextContent('Hello, Alice!');
});

test('handles a blank name when submitted with the keyboard', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByRole('textbox', { name: 'Name' }), '   {Enter}');
  expect(screen.getByRole('status')).toHaveTextContent('Hello, World!');
});
