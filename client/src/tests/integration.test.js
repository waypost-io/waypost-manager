import React from 'react';
import '@testing-library/jest-dom';
// We're using our own custom render function and not RTL's render.
// Our custom utils also re-export everything from RTL
// so we can import fireEvent and screen here as well
import { render, fireEvent, screen } from './utils/test-utils';
import App from '../App';
import { server } from './utils/testServer';

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test('Title and sidebar display', async () => {
  render(<App />);
  expect(screen.getByText("Waypost")).toBeInTheDocument();
  expect(screen.getByTestId('flagsLink')).toBeInTheDocument();
  expect(screen.getByTestId('metricsLink')).toBeInTheDocument();
  expect(screen.getByTestId('logLink')).toBeInTheDocument();
  expect(screen.getByTestId('sdkKeyLink')).toBeInTheDocument();
});

test('Shows flags', async () => {
  render(<App />);
  expect(await screen.findByText("Test Flag 1")).toBeInTheDocument();
  expect(await screen.findByText("Test Flag 2")).toBeInTheDocument();
});