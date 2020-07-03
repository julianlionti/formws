import React, {
  useReducer,
  useRef,
  useContext,
  useCallback,
  createContext,
  useEffect,
  useState
} from 'react'
import axios from 'axios'
import usePrevious from './usePrevious'
// import CustomError, { CustomErrorProps } from './CustomError' // eslint-disable-line

interface WSProps {
  children: React.Component<any, any>
  intial?: any
  urls: {
    [url: string]: string
  }
  headers?: {}
  defaultParams?: {}
  user?: {}
  timeout?: number
  onUser?: (user: any) => void
}

interface ErrorProps {
  message: string
  code: number
}

type State = {
  isLoading: boolean
  error?: ErrorProps | null
  url: string
  data?: any
}

type InitialState = {
  [key: string]: State
}

type Action = {
  type: 'request' | 'clean'
  key: string
  results?: any
  error?: ErrorProps
  data?: {} | []
}

interface ContextState {
  dispatch: React.Dispatch<Action>
  state: InitialState
  headers?: {}
  defaultParams?: {}
  timeout?: number
  user?: {}
  setUser?: any
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
        [key]: {
          ...defValues,
          url: state[key].url
        }
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
  timeout,
  onUser
}: WSProps) => {
  const initialState: InitialState = Object.keys(urls).reduce(
    (acc, it) => ({ ...acc, [it]: { ...defValues, url: urls[it] } }),
    {}
  )
  const [usuario, setUsuario] = useState<any>(user)

  useEffect(() => {
    if (onUser) {
      if (usuario === null || Object.keys(usuario).length > 0) onUser(usuario)
    }
  }, [usuario])

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WsContext.Provider
      value={{
        state,
        dispatch,
        headers,
        defaultParams,
        timeout,
        user: usuario,
        setUser: setUsuario
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
  isFormData?: boolean
}

type Fetch = {
  hookId: number
  call: (props: FetchProps) => {}
  clean: () => void
  refresh: () => void
}

export const getState = (): InitialState => {
  const { state } = useContext(WsContext)
  return state
}

export const getUser = (): undefined | {} => {
  const { user } = useContext(WsContext)
  return user
}

export const updateUser = () => {
  const { setUser } = useContext(WsContext)

  const updateUser = useCallback((user) => setUser(user), [])
  return updateUser
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
      const {
        method = 'GET',
        query,
        transformData,
        data: remoteData,
        isFormData
      } = props
      if (actual.isLoading) return
      lastFetch.current = props
      dispatch({ type: 'request', key, data: remoteData })
      try {
        const extraHeaders = isFormData
          ? { 'content-type': 'multipart/form-data' }
          : {}

        const finalHeaders = { ...headers, ...extraHeaders }
        const finalParams = { ...defaultParams, ...query }
        let formData: any = null
        if (isFormData) {
          formData = Object.keys(finalParams).reduce((acc, cur) => {
            acc.append(cur, finalParams[cur])
            return acc
          }, new FormData())
        }

        const respuesta = await axios({
          timeout,
          timeoutErrorMessage: 'Timeout',
          url: actual.url,
          method, // : method === 'GET' ? 'GET' : 'POST',
          params: method === 'GET' ? formData || finalParams : undefined,
          data: method === 'POST' ? formData || finalParams : undefined,
          headers: finalHeaders
        })

        const { data }: any = respuesta
        let results = data
        if (transformData) {
          results = await transformData(data)
        }

        dispatch({ type: 'request', key, results })
        return { type: 'request', key, results }
        /*
        console.log(respuesta)
        if (status >= 200 && status < 300) {
         
        } else {
          const error: ErrorProps = { message: 'Error servidor', code: status }
          dispatch({ type: 'request', key, error })
          return { type: 'request', key, error }
        } */
      } catch (ex) {
        const { status, data } = ex.response || {}

        const isTimeOut = ex.message === 'Timeout'
        const error: ErrorProps = {
          message: isTimeOut ? 'Tiempo de espera agotado' : data || ex.message,
          code: isTimeOut ? 999 : status || 500
        }

        dispatch({ type: 'request', key, error })
        return { type: 'request', key, error }
      }
    },
    [actual]
  )

  const clean = useCallback(() => {
    dispatch({ type: 'clean', key })
  }, [])

  const refresh = useCallback(() => {
    call(lastFetch.current)
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
    clean,
    refresh
  }
}
