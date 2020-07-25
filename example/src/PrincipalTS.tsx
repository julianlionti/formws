import React from 'react'
import { useFetch, updateUser, getUser } from 'formws'
import urls from './urls'

type Keys = keyof typeof urls

export default () => {
  const setUser = updateUser()
  const user = getUser()
  const { call, isLoading, data, error } = useFetch<Keys>('espe')
  console.log(data, error, user)

  return (
    <div>
      <p onClick={() => setUser({ uid: 'HEDZDko7smbIfI3KnQR2VR5gsCw2' })}>
        Setear usuario
      </p>
      <button
        onClick={() => {
          call({
            method: 'POST',
            query: {
              items: {},
              direccion: {}
            }
          })
        }}
      >
        Llamar
      </button>
      {isLoading && <p>Cargando</p>}
    </div>
  )
}
