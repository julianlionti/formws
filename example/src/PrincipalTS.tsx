import React, { memo } from 'react'
import { useFetch } from 'formws'
import urls from './urls'

type Keys = keyof typeof urls

const Prueba = memo((props: { index: number }) => {
  const { call } = useFetch<Keys>('espe', props.index)
  return (
    <p
      onClick={() => {
        call({ method: 'POST' })
      }}
    >
      Setear usuario {props.index}
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
