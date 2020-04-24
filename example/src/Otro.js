import React from 'react'
import { useFetch } from 'formws'

export default () => {
  const { data } = useFetch('map')

  const tam = 0

  return <p>{`Ver si exite ya: ${JSON.stringify(data)}`}</p>
}
