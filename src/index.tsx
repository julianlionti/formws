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
  user?: {}
  headers?: {}
  defaultParams?: {}
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
  const { key } = action
  switch (action.type) {
    case 'request': {
      const isLoading = !(action.error || action.results)
      return {
        ...state,
        [key]: {
          ...state[key],
          isLoading,
          data: isLoading ? undefined : action.results || state[key].data,
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
  user
}: WSProps) => {
  const initialState: InitialState = Object.keys(urls).reduce(
    (acc, it) => ({ ...acc, [it]: { ...defValues, url: urls[it] } }),
    {}
  )

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WsContext.Provider
      value={{ state, dispatch, headers, defaultParams, user }}
    >
      {children}
    </WsContext.Provider>
  )
}

interface FetchProps {
  method?: 'POST' | 'GET'
  query?: {}
  transformData?: (data: any) => any
}

type Fetch = {
  call: (props: FetchProps) => {}
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
  const { state, dispatch, headers, defaultParams = {} } = useContext(WsContext)
  const prevHeaders = usePrevious(headers)
  const actual = state[key]

  const call = useCallback(async (props: FetchProps) => {
    const { method, query, transformData } = props
    if (actual.isLoading) return

    lastFetch.current = props
    dispatch({ type: 'request', key })
    try {
      const { data, status } = await axios({
        url: actual.url,
        method,
        params: method === 'GET' ? { ...defaultParams, ...query } : undefined,
        data: method === 'POST' ? { ...defaultParams, ...query } : undefined,
        headers
      })

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
    hookId
  }
}
