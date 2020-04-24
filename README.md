# formws

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/formws.svg)](https://www.npmjs.com/package/formws) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save formws
```

## Usage

```tsx
import React, { Component } from 'react'

import { WsProvider } from 'formws'

const App = () => {
  return (
    <WsProvider
      urls={{
        ejemplo: 'www.ejemplo.com',
        ejemplo1: 'www.ejemplo1.com'
      }}
    >
      <RestApp />
    </WsProvider>
  )
}
```

```tsx
import React, { Component } from 'react'

import { WsProvider, useFetch } from 'formws'

const InsideComponente = () => {
  const { data, isLoading, error, llamar } = useFetch('ejemplo')

  useEffect(() => {
    llamar({ methor: 'GET', query: {} })
  }, [])

  return (
    <>
      <Components />
    </>
  )
}
```

## License

MIT © [Julián Lionti](https://github.com/Julián Lionti)
