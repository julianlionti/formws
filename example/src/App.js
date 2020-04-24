import React, { useState } from 'react'

import { WSProvider } from 'formws'
import 'formws/dist/index.css'
import PrincipalJS from './PrincipalJS'
import PrincipalTS from './PrincipalTS.tsx'
import urls from './urls'

const App = () => {
  const [config, setConfig] = useState({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  })
  
  return (
    <WSProvider config={config} urls={urls}>
      <div>
        <PrincipalJS />
        <PrincipalTS />
        <button
          onClick={() => {
            setConfig((conf) => ({
              ...conf,
              Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOjgwLCJkZXZpY2VfaWQiOm51bGx9.U2YI9omBcE_Gx9BgIIJe9MSfKYodKCyVLfU87K6C_aQ'}`
            }))
          }}
        >
          Cambair estado
        </button>
      </div>
    </WSProvider>
  )
}

export default App
