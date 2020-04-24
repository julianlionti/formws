import React from 'react'

import { ExampleComponent, WSProvider } from 'formws'
import 'formws/dist/index.css'
import PrincipalJS from './PrincipalJS'
import PrincipalTS from './PrincipalTS.tsx'

const url = 'https://stage.fidus.com.ar/api'

export const urls = {
  map: `${url}/v1/branch_offices`,
  local: `${url}/v1/clients_branch_offices/store_detail/1`,
  rewards: `${url}/v2/categories`
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
