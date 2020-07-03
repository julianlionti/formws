import React, { useState } from 'react'

import { WSProvider } from 'formws'
import 'formws/dist/index.css'
import PrincipalJS from './PrincipalJS'
import PrincipalTS from './PrincipalTS.tsx'
import urls from './urls'

const App = () => {
  return (
    <WSProvider urls={{ get: 'sarasa' }}>
      <div>
        {/* <PrincipalJS />
        <PrincipalTS /> */}
        <button>Cambair estado</button>
      </div>
    </WSProvider>
  )
}

export default App
