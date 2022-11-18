import { FC, Fragment, useReducer, useState } from "react"
import { useForm } from "../hooks/useForm"
import { ErrorMessage } from "./ErrorMessage"

const validate = (values: {[k: string]: string}) => {
    const errors = {} as {[P in keyof typeof values]?: string}

    Object.entries(values).forEach(([key, nb]) => {
        if (key.includes('num_field')) {
            const number = Number(nb)
            if (isNaN(number)) {
                errors[key] = 'The value should be a number'
            } else if (number < 0) {
                errors[key] = 'The value should be equal or greater than 0'
            } else if (number > 1000000) {
                errors[key] = 'The value should be equal or less than 1 000 000'
            }
        }
    })

    return errors;
}

const getId = () => Math.round(Math.random() * 10000)

const generateFieldName = (id: number) => `num_field_${id}`

interface SortedNumbersProps {
    numbers: number[]
    reset?: () => void
}
const SortedNumbers: FC<SortedNumbersProps> = ({numbers, reset}) => {
    return (
        <>
            <p>Result: { numbers.join(', ')}</p>
            { reset && 
                <button className="button" onClick={reset}>Back</button>
            }
        </>
    )
}

export function FormBuilder() {
    const initalId = getId()
    const [inputs, addInput] = useReducer(inputs => [...inputs, getId()], [initalId])
    const [sortedNumbers, setSortedNumbers] = useState([])

    const {
        errors,
        visited,
        handleSubmit,
        getFieldProps,
    } = useForm({
        initialValues: { [generateFieldName(initalId)]: '3' },
        onSubmit: async (values) => {
            const res = await fetch('/api/sort', {
                method: 'POST',
                body: JSON.stringify(values)
            })
            const data = await res.json()
            setSortedNumbers(data)
        },
        validate,
    })

    const reset = () => {
        setSortedNumbers([])
    }

    if (sortedNumbers.length) return <SortedNumbers numbers={sortedNumbers} reset={reset} />

    return (
        <>
            <p>Choose numbers from 0 to 1 000 000</p>
            <form onSubmit={handleSubmit} data-testid="form">
                {
                    inputs.map((id) => {
                        const fieldName = generateFieldName(id)
                        return <Fragment key={id}>
                            <input
                                type="number"
                                className="input"
                                {...getFieldProps(fieldName)}
                            />
                            { 
                                errors[fieldName] && visited[fieldName]
                                    ? <ErrorMessage text={errors[fieldName]!} />
                                    : null
                            }
                        </Fragment>
                    })
                }
                <button type="button" className='button button--secondary' onClick={addInput}>Add a Number</button>
                <button className='button'>Sort</button>
                { 
                    errors.submit
                        ? <ErrorMessage text={errors.submit!} />
                        : null
                }
            </form>
        </>
    )
}