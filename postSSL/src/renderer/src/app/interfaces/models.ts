export type Collection = {
  _id?: string
  name: string
  description: string
  schema: string
  _exporter_id: number
  type: string
  item?: [Folder | Api]
  variable?: [Variable]
}

export type Folder = {
  _id?: string
  name: string
  type: string
  description: string
  collection_id: string
  item?: [Api]
}

export type Api = {
  _id?: string
  type: string
  name: string
  folder_id?: string
  collection_id: string
  modified: boolean
  request: ApiRequest
  defaultStatusCode?: number
  response: [ApiResponse?]
  active_example_id?: string
}

type ApiRequest = {
  method: string
  header: []
  body?: ApiRequestBody
  url?: ApiRequestUrl
}

type ApiRequestBody = {
  mode: string
  raw?: string
  options?: {
    raw: {
      language: string
    }
  }
}

type ApiRequestUrl = {
  raw?: string
  protocol?: string
  host?: [string]
  port?: number
  path?: [string]
  query?: [ApiQuery?]
}

type ApiResponse = {
  _id: string
  name: string
  originalRequest?: ApiRequest
  header: []
  body: string
}

type ApiQuery = {
  key: string
  value: string
  description?: string
  disabled?: boolean
}

type Variable = {
  key: string
  value: string
}
