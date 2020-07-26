import React, {
  useReducer,
  useRef,
  useContext,
  useCallback,
  createContext,
  useEffect,
  useState
} from 'react'
import axios, { Method } from 'axios'
import usePrevious from './usePrevious'

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
  id?: string | number
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
  const { key, data, id } = action
  const keypiola = `${key}${id !== undefined ? '-' + id : ''}`
  switch (action.type) {
    case 'clean': {
      return {
        ...state,
        [keypiola]: {
          ...defValues,
          url: state[key].url
        }
      }
    }
    case 'request': {
      const isLoading = !(action.error || action.results)
      return {
        ...state,
        [keypiola]: {
          ...state[keypiola],
          isLoading,
          data:
            isLoading && data ? data : action.results || state[keypiola]?.data,
          error: isLoading ? undefined : action.error || state[keypiola].error
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
      if (usuario === null || Object.keys(usuario || {}).length > 0)
        onUser(usuario)
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
  method?: Method // 'POST' | 'GET'
  query?: {}
  transformData?: (data: any) => any
  data?: {} | []
  isFormData?: boolean
  forceSync?: boolean
  urlParams?: string[]
  noHeaders?: boolean
}

interface ResponseProps {
  error?: ErrorProps
  results?: any
  key: keyof InitialState
}

type Fetch = {
  hookId: number
  call: (props: FetchProps) => Promise<ResponseProps | null>
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

interface RequestProps {
  isFormData?: boolean
  headers?: {}
  defaultParams?: {}
  query?: {}
  timeout?: number
  url: string
  method: Method
  transformData?: (data: any) => {} | []
  urlParams?: string[]
}

export const makeRequest = async ({
  isFormData,
  headers,
  defaultParams,
  query,
  timeout,
  url,
  method,
  transformData,
  urlParams
}: RequestProps) => {
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

  const finalUrl =
    urlParams !== undefined ? url + '/' + urlParams?.join('/') : url
  const respuesta = await axios({
    timeout,
    timeoutErrorMessage: 'Timeout',
    url: finalUrl,
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
  return results
}

export const useFetch = <T extends string>(
  key: T,
  id?: string | number
): Fetch & State => {
  const hookId = useRef(Math.random()).current
  const lastFetch = useRef<any>()
  const {
    state,
    dispatch,
    headers,
    defaultParams = {},
    timeout = 15000
  } = useContext(WsContext)
  const prevHeaders = usePrevious(headers)

  const keypiola = `${key}${id !== undefined ? '-' + id : ''}`
  const actual = state[keypiola] || state[key]

  const call = useCallback(
    async (props: FetchProps): Promise<ResponseProps | null> => {
      const {
        method = 'GET',
        query,
        transformData,
        data: remoteData,
        isFormData,
        forceSync,
        urlParams,
        noHeaders
      } = props
      if (actual.isLoading) return null
      lastFetch.current = props

      if (forceSync !== true)
        dispatch({ type: 'request', key, data: remoteData, id })

      try {
        const results = await makeRequest({
          method,
          query,
          transformData,
          isFormData,
          url: actual.url,
          defaultParams,
          timeout,
          urlParams,
          headers: noHeaders ? undefined : headers
        })

        if (forceSync !== true) dispatch({ type: 'request', key, results, id })

        return { key, results }
      } catch (ex) {
        const { status, data } = ex.response || {}

        const isTimeOut = ex.message === 'Timeout'
        const error: ErrorProps = {
          message: isTimeOut ? 'Tiempo de espera agotado' : data || ex.message,
          code: isTimeOut ? 999 : status || 500
        }

        if (forceSync !== true) dispatch({ type: 'request', key, error, id })

        return { key, error }
      }
    },
    [actual, headers, defaultParams, timeout]
  )

  const clean = useCallback(() => {
    dispatch({ type: 'clean', key, id })
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
