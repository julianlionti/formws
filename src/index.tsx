import React, {
  useReducer,
  useRef,
  useContext,
  useCallback,
  createContext,
  useEffect
} from 'react'
import axios from 'axios'
import usePrevious from './usePrevious'

interface WSProps {
  children: React.Component
  intial?: any
  urls: {
    [url: string]: string
  }
  headers?: {}
  defaultParams?: {}
  user?: {}
  timeout?: number
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
  type: 'request' | 'clean'
  key: string
  results?: any
  error?: string | {}
  data?: {} | []
}

interface ContextState {
  dispatch: React.Dispatch<Action>
  state: InitialState
  user?: {}
  headers?: {}
  defaultParams?: {}
  timeout?: number
}

const WsContext = createContext<ContextState>({
  dispatch: () => {},
  state: {}
})

const defValues: State = {
  isLoading: false,
  url: ''
}

const reducer = (state: InitialState, action: Action): InitialState => {
  const { key, data } = action
  switch (action.type) {
    case 'clean': {
      return {
        ...state,
        [key]: defValues
      }
    }
    case 'request': {
      const isLoading = !(action.error || action.results)
      return {
        ...state,
        [key]: {
          ...state[key],
          isLoading,
          data: isLoading && data ? data : action.results || state[key].data,
          error: isLoading ? undefined : action.error || state[key].error
        }
      }
    }
  }
}

export const WSProvider = ({
  children,
  urls,
  headers,
  defaultParams,
  user,
  timeout
}: WSProps) => {
  const initialState: InitialState = Object.keys(urls).reduce(
    (acc, it) => ({ ...acc, [it]: { ...defValues, url: urls[it] } }),
    {}
  )

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WsContext.Provider
      value={{
        state,
        dispatch,
        headers,
        defaultParams,
        user,
        timeout
      }}
    >
      {children}
    </WsContext.Provider>
  )
}

interface FetchProps {
  method?: 'POST' | 'GET'
  query?: {}
  transformData?: (data: any) => any
  data?: {} | []
}

type Fetch = {
  call: (props: FetchProps) => {}
  clean: () => void
  hookId: number
}

export const getState = (): InitialState => {
  const { state } = useContext(WsContext)
  return state
}

export const getUser = (): undefined | {} => {
  const { user } = useContext(WsContext)
  return user
}

export const useFetch = <T extends string>(key: T): Fetch & State => {
  const { current: hookId } = useRef(Math.random())
  const lastFetch = useRef<any>()
  const {
    state,
    dispatch,
    headers,
    defaultParams = {},
    timeout = 15000
  } = useContext(WsContext)
  const prevHeaders = usePrevious(headers)
  const actual = state[key]

  const call = useCallback(
    async (props: FetchProps) => {
      const { method, query, transformData, data: remoteData } = props
      if (actual.isLoading) return

      lastFetch.current = props
      dispatch({ type: 'request', key, data: remoteData })
      try {
        const race = await Promise.race([
          axios({
            url: actual.url,
            method,
            params:
              method === 'GET' ? { ...defaultParams, ...query } : undefined,
            data:
              method === 'POST' ? { ...defaultParams, ...query } : undefined,
            headers
          }),
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: 'timeout' }), timeout)
          )
        ])
        const { data, status, error }: any = race
        if (error === 'timeout') {
          throw new Error('Timeout')
        }
        if (status >= 200 && status < 300) {
          let results = data
          if (transformData) {
            results = await transformData(data)
          }

          dispatch({ type: 'request', key, results })
          return { type: 'request', key, results }
        } else {
          throw new Error('Error En servidor')
        }
      } catch (ex) {
        dispatch({ type: 'request', key, error: ex.message })
        return { type: 'request', key, error: ex.message }
      }
    },
    [actual]
  )

  const clean = useCallback(() => {
    dispatch({ type: 'clean', key })
  }, [])

  useEffect(() => {
    if (
      prevHeaders &&
      lastFetch.current &&
      JSON.stringify(headers) !== JSON.stringify(prevHeaders)
    ) {
      call(lastFetch.current)
    }
  }, [headers])

  return {
    ...actual,
    call,
    hookId,
    clean
  }
}
