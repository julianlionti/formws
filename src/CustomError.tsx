export interface CustomErrorProps {
  message: string
  code: number
}

// export default class CustomError {
//   constructor({ message, code }: CustomErrorProps) {
//     const error = Error(message)

//     const customError = {
//       ...error,
//       message,
//       code,
//       name: 'CustomError'
//     }

//     Error.captureStackTrace(customError, CustomError)
//     return error
//   }
// }
