import React from 'react';

import { render, fireEvent, waitFor, getByText as globalGetByText} from '@testing-library/react';
import App from './App';

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

test('rendering main blocks', () => {
  const {container} = render(<App/>);

  expect(container.querySelector('.stop-input')).toBeInTheDocument();
  expect(container.querySelector('.route-area-wrapper')).not.toBeInTheDocument();
  expect(container.querySelector('.map')).toBeInTheDocument();
  expect(container.querySelector('.search-wrapper')).toBeInTheDocument();
  expect(container.querySelector('.swap-icon')).toBeInTheDocument();
});

test('general use case scenario', async () => {
  const {container} = render(<App/>);

  const searchStopInput = container.querySelector('.stop-input input');
  expect(searchStopInput).toBeInTheDocument();

  fireEvent.change(searchStopInput, {target: {value: 'he'}});
  expect(searchStopInput.value).toBe('he');

  await waitFor(() => expect(globalGetByText(document.body, 'Henrikintie (E1986)')).toBeInTheDocument(), {timeout: 10000});

  const firstOption = globalGetByText(document.body, 'Henrikintie (E1986)');
  fireEvent.click(firstOption);

  await waitFor(() => expect(globalGetByText(document.body, "Routes:")).toBeInTheDocument(), {timeout: 10000});
});


