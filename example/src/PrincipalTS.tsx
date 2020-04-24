import React, { useEffect, useState } from 'react'
import { useFetch } from 'formws'
import { urls } from './App'
import Otro from './Otro'

type Keys = keyof typeof urls

export default () => {
  const { llamar, error, isLoading, data } = useFetch<Keys>('map')
  const [prueba, setPrueba] = useState(false)

  useEffect(() => {
    if (data === undefined) {
      llamar({})
      setTimeout(() => {
        setPrueba(true)
      }, 3000)
    }
  }, [data, llamar])

  return (
    <div>
      <p>Vamos Racing: TypeScript</p>
      {prueba && <Otro />}
    </div>
  )
}
