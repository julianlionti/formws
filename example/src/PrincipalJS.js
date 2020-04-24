import React from 'react'
import { useFetch } from 'formws'
import { urls } from './App'

export default () => {
  const prueba = useFetch('local')
  // console.log('JS', prueba)
  return <p>Vamos Racing: TypeScript</p>
}
