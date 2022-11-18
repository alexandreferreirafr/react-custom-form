import React, { useEffect, useState } from "react"

interface FormConfig<T extends { [key: string]: string }> {
    initialValues: T
    onSubmit: (values: T) => void
    validate?: (values: T) => {[P in keyof T]?: string}
}

type HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void
type HandleBlur = (e: React.FocusEvent<HTMLInputElement>) => void
interface fieldProps<T> {
    name: string
    value: string
    onChange: HandleChange,
    onBlur: HandleBlur,
}

interface FormProps<T extends { [key: string]: string }> {
    values: T
    errors: {[P in keyof T]?: string} & { submit?: string}
    visited: {[P in keyof T]?: boolean}
    handleSubmit: (e: React.FormEvent) => void
    handleChange: HandleChange
    handleBlur: HandleBlur
    getFieldProps: (fieldName: string) => fieldProps<T>
}

export function useForm<T extends { [key: string]: string }>({
    initialValues,
    onSubmit,
    validate,
}: FormConfig<T>): FormProps<T> {

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [visited, setVisited] = useState({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value, name } } = e
        setValues(prev => ({ 
            ...prev,
            [name]: value
        }))
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { target: { name } } = e
        setVisited(prev => ({
            ...prev,
            [name]: true,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (Object.keys(errors).length) {
            setErrors(prev => ({
                ...prev,
                submit: 'Some fields contains errors!',
            }))
            return;
        }
        
        onSubmit(values)
    }

    const getFieldProps = (fieldName: string) => ({
        name: fieldName,
        value: values[fieldName] || '',
        onChange: handleChange,
        onBlur: handleBlur,
    })

    useEffect(() => {
        if (validate) {
            setErrors(validate(values))
        }
    }, [values])

    return {
        values,
        errors,
        visited,
        handleChange,
        handleSubmit,
        handleBlur,
        getFieldProps,
    }
}
