import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormBuilder } from './FormBuilder';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('FormBuilder component', () => {

    test('renders add field button', () => {
      render(<FormBuilder />)
      const addButton = screen.getByText(/Add a number/i)
      expect(addButton).toBeInTheDocument()
    })

    test('renders input field', () => {
      const {container} = render(<FormBuilder />)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toEqual(1)
    })

    test('add input field', () => {
        const {container} = render(<FormBuilder />)
        const addButton = screen.getByText(/Add a number/i)

        act(() => {
            fireEvent.click(addButton)
        })

        const inputs = container.querySelectorAll('input')
        expect(inputs.length).toEqual(2)
    })
})
