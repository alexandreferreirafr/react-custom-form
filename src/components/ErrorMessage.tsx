import './ErrorMessage.css'

interface ErrorMessageProps {
    text: string
}
export function ErrorMessage ({text}: ErrorMessageProps) {
    return (
        <p className='error-message'>
            {text}
        </p>
    )
}