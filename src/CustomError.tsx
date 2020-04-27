interface Props {
  message: string
  code: number
}

export default class CustomError {
  constructor({ message, code }: Props) {
    const error = Error(message)

    const customError = {
      ...error,
      message,
      code,
      name: 'CustomError'
    }

    Error.captureStackTrace(customError, CustomError)
    return error
  }
}
