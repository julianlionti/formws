import React, { useEffect, useState } from 'react'
import { useFetch } from 'formws'
import Otro from './Otro'
import urls from './urls'

type Keys = keyof typeof urls

export default () => {
  const { call, error, isLoading, data } = useFetch<Keys>('local')
  const [prueba, setPrueba] = useState(false)

  useEffect(() => {
    if (!data && !error) {
      call({
        // transformData: (data) => data.filter(({ id }: any) => id === 83)
      })
    }
  }, [call, data, error])

  console.log(isLoading, data)

  return (
    <div>
      <p>Vamos Racing: TypeScript</p>
      <button onClick={() => setPrueba(!prueba)}>Mostrar/Ocultas</button>
      {isLoading && <p>Cargando</p>}
      {prueba && !isLoading && <Otro />}
    </div>
  )
}
