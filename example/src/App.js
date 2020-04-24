import React from 'react'

import { WSProvider } from 'formws'
import 'formws/dist/index.css'
import PrincipalJS from './PrincipalJS'
import PrincipalTS from './PrincipalTS.tsx'

const url = 'https://www.prueba.com/api'

export const urls = {
  map: `${url}/v1/prueba`,
  local: `${url}/v1/prueba2`,
  rewards: `${url}/v1/prueba3`
}

const App = () => {
  return (
    <WSProvider urls={urls}>
      <div>
        <PrincipalJS />
        <PrincipalTS />
      </div>
    </WSProvider>
  )
}

export default App
