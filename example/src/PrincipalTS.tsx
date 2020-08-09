import React, { memo, useState } from 'react'
import { useFetch } from 'formws'
import urls from './urls'

type Keys = keyof typeof urls

const Prueba = memo((props: { index: number }) => {
  const { call } = useFetch<Keys>('espe', props.index)
  const [prueba, setPrueba] = useState(false)
  return (
    <p
      onClick={() => {
        call({
          method: 'POST',
          query: { id: '5f1c591d84e0ad2e943edac7', confirmado: !prueba }
        })
        setPrueba((act) => !act)
      }}
    >
      Setear usuario {props.index} {prueba ? 'SI' : 'NO'}
    </p>
  )
})

export default () => {
  return (
    <div>
      {[0, 1, 2].map((e) => {
        return <Prueba key={e} index={e} />
      })}
    </div>
  )
}
