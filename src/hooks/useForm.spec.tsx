import {renderHook} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import {  useForm } from './useForm'


describe('useForm', () => {
    test('return inital value', () => {
        const expected = {name: 'John Doe'}
        const { result } = renderHook(() => useForm({
            initialValues: expected,
            onSubmit: jest.fn()
        }))
        expect(result.current.values).toEqual(expected)
    })

    test('handle form sumbit', () => {
        const expected = {name: 'John Doe'}
        const onSubmit = jest.fn()

        const { result } = renderHook(() => useForm({
            initialValues: expected,
            onSubmit
        }))

        act(() => {
            result.current.handleSubmit({
                preventDefault: jest.fn(),
            } as unknown as React.FormEvent)
        })


        expect(onSubmit).toBeCalled()
        expect(onSubmit).toBeCalledWith(expected)
    })

    test('handle field change', () => {
        const expected = {name: 'John Doe'}
        const onSubmit = jest.fn()

        const { result } = renderHook(() => useForm({
            initialValues: {name: ''},
            onSubmit
        }))

        act(() => {
            result.current.handleChange({
                preventDefault: jest.fn(),
                target: {
                    name: 'name',
                    value: 'John Doe'
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>)
        })

        expect(result.current.values).toEqual(expected)
    })

    test('handle field blur', () => {
        const expected = { name: true }
        const onSubmit = jest.fn()

        const { result } = renderHook(() => useForm({
            initialValues: {name: ''},
            onSubmit
        }))

        act(() => {
            result.current.handleBlur({
                preventDefault: jest.fn(),
                target: {
                    name: 'name',
                    value: 'John Doe'
                }
            } as unknown as React.FocusEvent<HTMLInputElement>)
        })

        expect(result.current.visited).toEqual(expected)
    })

    test('field validation', () => {
        const expected = {name: 'John Doe'}
        const onSubmit = jest.fn()

        const validate = (values: { name: string }) => {
            const errors = {} as {[P in keyof typeof values]?: string}

            if (!values.name) {
                errors.name = 'Name is required!'
            } else if (/[A-Z\s-]+/i.test(values.name)) {
                errors.name = 'Name is invalid!'
            }

            return errors;
        }

        const { result } = renderHook(() => useForm({
            initialValues: {name: ''},
            onSubmit,
            validate,
        }))

        act(() => {
            result.current.handleChange({
                preventDefault: jest.fn(),
                target: {
                    name: 'name',
                    value: ''
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>)
        })

        expect(result.current.errors.name).toEqual('Name is required!')

        act(() => {
            result.current.handleChange({
                preventDefault: jest.fn(),
                target: {
                    name: 'name',
                    value: 'John@Doe'
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>)
        })

        expect(result.current.errors.name).toEqual('Name is invalid!')
    })

    test('submisson with errors', () => {
        const onSubmit = jest.fn()

        const validate = (values: { name: string }) => {
            const errors = {} as {[P in keyof typeof values]?: string}

            if (!values.name) {
                errors.name = 'Name is required!'
            } else if (/[A-Z\s-]+/i.test(values.name)) {
                errors.name = 'Name is invalid!'
            }

            return errors;
        }

        const { result } = renderHook(() => useForm({
            initialValues: {name: ''},
            onSubmit,
            validate,
        }))

        act(() => {
            result.current.handleChange({
                preventDefault: jest.fn(),
                target: {
                    name: 'name',
                    value: 'John@Doe'
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>)
        })
        
        act(() => {
            result.current.handleSubmit({
                preventDefault: jest.fn(),
            } as unknown as React.FormEvent)
        })
        
        expect(result.current.errors.submit).toEqual('Some fields contains errors!')
    })

    test('get field props', () => {
        const onSubmit = jest.fn()
        
        const { result } = renderHook(() => useForm({
            initialValues: {name: ''},
            onSubmit
        }))

        const expected = {
            name: 'name',
            value: 'John Doe',
            onChange: result.current.handleChange,
            onBlur: result.current.handleBlur,
        }

        act(() => {
            result.current.handleChange({
                preventDefault: jest.fn(),
                target: {
                    name: 'name',
                    value: 'John Doe'
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>)
        })

        const received = JSON.stringify(result.current.getFieldProps('name'))
        expect(received).toEqual(JSON.stringify(expected))
    })
})