import * as React from 'react'
import axios from 'axios'

interface WSProps {
  children: React.Component
  intial?: any
  urls: {
    [url: string]: string
  }
}

type State = {
  isLoading: boolean
  data?: [] | {} | null
  error?: string | {} | null
  url: string
}

type InitialState = {
  [key: string]: State
}

type Action = {
  type: 'request'
  key: string
  results?: any
  error?: string | {}
}

interface ContextState {
  dispatch: React.Dispatch<Action>
  state: InitialState
}

const WsContext = React.createContext<ContextState>({
  dispatch: () => {},
  state: {}
})

const defValues: State = {
  isLoading: false,
  url: ''
}

const reducer = (state: InitialState, action: Action): InitialState => {
  const { key } = action
  switch (action.type) {
    case 'request':
      return {
        ...state,
        [key]: {
          ...state[key],
          isLoading: !(action.error || action.results),
          data: action.results || state[key].data,
          error: action.error || state[key].error
        }
      }
  }
}

export const WSProvider = ({ children, urls }: WSProps) => {
  const initialState: InitialState = Object.keys(urls).reduce(
    (acc, it) => ({ ...acc, [it]: { ...defValues, url: urls[it] } }),
    {}
  )

  const [state, dispatch] = React.useReducer(reducer, initialState)
  return (
    <WsContext.Provider value={{ state, dispatch }}>
      {children}
    </WsContext.Provider>
  )
}

interface FetchProps {
  method?: 'POST' | 'GET'
  query?: {}
}

type Fetch = {
  llamar: (props: FetchProps) => {}
}

export const useFetch = <T extends string>(key: T): Fetch & State => {
  const { state, dispatch } = React.useContext(WsContext)
  const actual = state[key]

  const llamar = React.useCallback(
    async ({ method = 'GET', query }: FetchProps) => {
      dispatch({ type: 'request', key })
      const respuesta = null
      try {
        const respuesta = () => {
          switch (method) {
            case 'POST':
              return axios.post(actual.url, query)
            default:
              return axios.get(actual.url, {
                params: query
              })
          }
        }
        const { data, status } = await respuesta()
        if (status >= 200 && status < 300)
          dispatch({ type: 'request', key, results: data })
        else {
          throw new Error('Error En servidor')
        }
      } catch (ex) {
        dispatch({ type: 'request', key, error: ex.message })
      }
      return respuesta
    },
    []
  )

  return {
    ...actual,
    llamar
  }
}
