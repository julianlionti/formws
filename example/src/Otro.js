import React from 'react'
import { useFetch } from 'formws'

export default () => {
  const { data } = useFetch('clqh')
  return <p>{`Ver si exite ya: ${JSON.stringify(data)}`}</p>
}
