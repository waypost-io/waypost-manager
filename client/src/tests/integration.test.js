import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from './utils/test-utils';
import App from '../App';
import { server } from './utils/testServer';

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test('Displays Title and sidebar on first load', () => {
  render(<App />);
  expect(screen.getByText("Waypost")).toBeInTheDocument();
  expect(screen.getByTestId('flagsLink')).toBeInTheDocument();
  expect(screen.getByTestId('metricsLink')).toBeInTheDocument();
  expect(screen.getByTestId('logLink')).toBeInTheDocument();
  expect(screen.getByTestId('sdkKeyLink')).toBeInTheDocument();
});

test('Shows flags on home page', async () => {
  render(<App />);
  expect(await screen.findByText("Test Flag 1")).toBeInTheDocument();
  expect(await screen.findByText("Test Flag 2")).toBeInTheDocument();
});

test('Shows metrics on metrics page', async () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('metricsLink'));
  expect(await screen.findByText("Signups")).toBeInTheDocument();
  expect(await screen.findByText("Time on site")).toBeInTheDocument();
});

test('Navigates to flag details page when name is clicked', async () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('flagsLink'));
  const flag1 = await screen.findByText("Test Flag 1");
  fireEvent.click(flag1);
  expect(screen.getByTestId('editFlagBtn')).toBeInTheDocument();
});

test('Shows flag events log after navigating to page', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('logLink'));
  expect(screen.getByTestId('flagLogTable')).toBeInTheDocument();
});

test('Custom assignments button changes after click', async () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('flagsLink'));
  const flag2 = await screen.findByText("Test Flag 2");
  fireEvent.click(flag2);
  const button = await screen.findByText("Show Custom Assignments");
  fireEvent.click(button);
  expect(button).toHaveTextContent("Hide Custom Assignments");
  fireEvent.click(button);
  expect(button).toHaveTextContent("Show Custom Assignments");
});
