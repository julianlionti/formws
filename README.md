# formws

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/formws.svg)](https://www.npmjs.com/package/formws) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install formws
yarn add formws
```

## Usage

```tsx
import React, { Component } from 'react'

import { WSProvider } from 'formws'

const App = () => {
  const [user, setUser] = useState({ nombre: 'Tano' })

  return (
    <WSProvider
      urls={{
        ejemplo: 'www.ejemplo.com',
        ejemplo1: 'www.ejemplo1.com'
      }}
      onUser={(user) => {
        if (user) {
          localStorage.setItem(Constants.CLIENT_INFO, JSON.stringify(user))
          setUser(user)
        } else {
          setUser(null)
          localStorage.removeItem(Constants.CLIENT_INFO)
        }
      }}
      user={user}
      headers={{
        Authorization: user ? `Bearer ${user.token}` : undefined
      }}
      defaultParams={{
        device_id: 'UNIQUE_ID'
      }}
    >
      >
      <RestApp />
    </WSProvider>
  )
}
```

```tsx
import React, { Component } from 'react'

import { WSProvider, useFetch } from 'formws'

const InsideComponente = () => {
  const { data, isLoading, error, call } = useFetch('ejemplo')

  useEffect(() => {
    call({ method: 'GET', query: {} })
  }, [])

  return (
    <>
      <Components />
    </>
  )
}
```

## Llamada sincrónica

```tsx
import React, { Component } from 'react'

import { WSProvider, useFetch } from 'formws'

const InsideComponente = () => {
  const { data, isLoading, error, call } = useFetch('ejemplo')

  return (
    <>
      <Components
        onClick={() => {
          const result = await call({ method: 'GET' })
          const { results, error } = respuesta
          if (error) {
            //Misma información que en el error de arriba
          }
          if (results) {
            // Misma información que en el data de arriba
          }
        }}
      />
    </>
  )
}
```

```tsx
import { useFetch } from 'formws'

const InsideComponente = () => {
  const {
    isLoading, // Cuando se llama a call, se pone true, cuando termina false
    call, // Se usa para llamar al endpoint
    clean, // Limpia el context de la última llamada
    hookId, // Para debuguear mejor
    url, // La url del endpoint
    data, // La data que devuelve el endpoint
    error // SI ocurrió algun error se llena esta variable
  } = useFetch('ejemplo')

  return (
    <>
      <Components
        onClick={() => {
          const result = await call({
            method: 'GET' // Metoodo HTTP
            query: {}, // Objeto con los parametros a enviar, dependiendo el metodo
            data: undefined || {} || [], // Objeto o array Para poner en el contexto antes de llamar
            transformData: undefined || (data) => {return data}, //Metodo para modificar el resultado antes de ponerlo en la variable data, lo que devuelva, va a estar ahí
            isFormData: undefined || true || false // Si estás mandando archivos, usar en true
          })
        }}
      />
    </>
  )
}
```

## License

MIT © [Julián Lionti](https://github.com/Julián Lionti)
