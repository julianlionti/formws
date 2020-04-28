import React, { useState } from 'react'

import { WSProvider } from 'formws'
import 'formws/dist/index.css'
import PrincipalJS from './PrincipalJS'
import PrincipalTS from './PrincipalTS.tsx'
import urls from './urls'

const App = () => {
  return (
    <WSProvider
      config={{
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOjU0LCJkZXZpY2VfaWQiOm51bGx9.kH-FMYmmhHjHw3xREUoVmIbRTJaUg6AHJG_GWgR8G4I'}`
      }}
      urls={urls}
    >
      <div>
        <PrincipalJS />
        <PrincipalTS />
        <button>Cambair estado</button>
      </div>
    </WSProvider>
  )
}

export default App
