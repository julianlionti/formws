import React, { useState } from 'react'

import { WSProvider } from 'formws'
import 'formws/dist/index.css'
import PrincipalJS from './PrincipalJS'
import PrincipalTS from './PrincipalTS.tsx'
import urls from './urls'

const App = () => {
  const [user, setUser] = useState()
  return (
    <WSProvider
      urls={urls}
      user={user}
      onUser={(usuario) => {
        console.log(usuario)
        setUser(usuario)
      }}
      headers={{
        Authorization: user ? `Basic ${user.uid}` : undefined
      }}
    >
      <div>
        {/* {/* <PrincipalJS /> */}
        <PrincipalTS />
        <button>Cambair estado</button>
      </div>
    </WSProvider>
  )
}

export default App
