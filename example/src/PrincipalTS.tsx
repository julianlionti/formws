import React, { useEffect, useState } from 'react'
import { useFetch, makeRequest } from 'formws'
import Otro from './Otro'
import urls from './urls'

type Keys = keyof typeof urls

const pruebas = async () => {
  // const pruesada = prueba<Keys>('clqh', { method: 'GET' })
  const result = await makeRequest({
    url: urls.clqh,
    urlParams: ['02'],
    method: 'GET'
  })
  console.log(result)
}

export default () => {
  const { call, error, isLoading, data } = useFetch<Keys>('clqh')
  const [prueba, setPrueba] = useState(false)

  useEffect(() => {
    if (!data && !error) {
      call({
        method: 'POST'
        // transformData: (data) => data.filter(({ id }: any) => id === 83)
      })
    }
  }, [call, data, error])
  console.log(data)
  return (
    <div>
      <p onClick={() => pruebas()}>Vamos Racing: TypeScript</p>
      <button onClick={() => setPrueba(!prueba)}>Mostrar/Ocultas</button>
      {isLoading && <p>Cargando</p>}
      {prueba && !isLoading && <Otro />}
    </div>
  )
}
