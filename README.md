# formws

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/formws.svg)](https://www.npmjs.com/package/formws) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Instalar

```bash
npm install formws
yarn add formws
```

## Descripcion

Librería para realizar llamadas a urls, y manejar usuarios dentro de la app.
Ventajas:
  Se escribe menos código.
  Se puede llamar tanto sincrónico como asincrónico.
  Manejo de usuario en React y React-Native
  Se unifican las URLS que se consumen
  Se usan las ultimas funciones de React, Context, useReducer
  Cada request que se haga, va a estar disponible en la totalidad de la aplicación al estilo del redux.
  
## Uso

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
      }} // Objeto con las urls para consumir dentro de la app
      onUser={(user) => {
        if (user) {
          localStorage.setItem(Constants.CLIENT_INFO, JSON.stringify(user))
          setUser(user)
        } else {
          setUser(null)
          localStorage.removeItem(Constants.CLIENT_INFO)
        }
      }} // Método que se llama cuando desde algún componente se utliza setUser. Ideal para usar tanto en react como react-native ya que podes guardarlo de la forma que pinte.
      user={user} // Si guardaste el usuario en algun lado, acá se lo pasas
      headers={{
        Authorization: user ? `Bearer ${user.token}` : undefined
      }} // Headers que van a tener TODAS las llamadas que se hagan
      defaultParams={{
        device_id: 'UNIQUE_ID'
      }} // Parametros por defecto que van a tener TODAS las llamadas
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

## API

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

## Licencia

MIT © [Julián Lionti](https://github.com/Julián Lionti)
