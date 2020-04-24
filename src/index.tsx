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
  config?: {}
  defaultParams?: {}
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
  config?: {}
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

export const WSProvider = ({
  children,
  urls,
  config,
  defaultParams
}: WSProps) => {
  const initialState: InitialState = Object.keys(urls).reduce(
    (acc, it) => ({ ...acc, [it]: { ...defValues, url: urls[it] } }),
    {}
  )

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WsContext.Provider value={{ state, dispatch, config, defaultParams }}>
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

export const useFetch = <T extends string>(key: T): Fetch & State => {
  const { current: hookId } = useRef(Math.random())
  const lastFetch = useRef<any>({})
  const { state, dispatch, config, defaultParams = {} } = useContext(WsContext)
  const prevConfig = usePrevious(config)
  const actual = state[key]

  const call = useCallback(async (props: FetchProps) => {
    const { method, query, transformData } = props
    lastFetch.current = props
    dispatch({ type: 'request', key })
    const respuesta = null
    try {
      const { data, status } = await axios({
        url: actual.url,
        params: method === 'GET' ? { ...defaultParams, ...query } : undefined,
        data: method === 'POST' ? { ...defaultParams, ...query } : undefined,
        headers: config
      })

      if (status >= 200 && status < 300) {
        let results = data
        if (transformData) {
          results = await transformData(data)
        }

        dispatch({ type: 'request', key, results })
      } else {
        throw new Error('Error En servidor')
      }
    } catch (ex) {
      dispatch({ type: 'request', key, error: ex.message })
    }
    return respuesta
  }, [])

  useEffect(() => {
    if (prevConfig && JSON.stringify(config) !== JSON.stringify(prevConfig)) {
      call(lastFetch.current)
    }
  }, [config])

  return {
    ...actual,
    call,
    hookId
  }
}
