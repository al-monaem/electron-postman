import { Api } from '@renderer/app/interfaces/models'
import { Button, Input, Popover, Select, Space, Tabs, theme } from 'antd'
import QueryParamForm from './QueryParamForm'
import RequestHeaderForm from './RequestHeaderForm'
import RequestBodyForm from './RequestBodyForm'
import store from '@renderer/app/store'
import { updateApi } from '@renderer/app/store/mock/tabSlice'
import ResponseBodyForm from './ResponseBodyForm'
import { TabTypes } from '@renderer/utilities/TabTypes'

const requestOptions = [
  {
    value: 'GET',
    label: <span className="text-green-600 font-semibold">GET</span>
  },
  {
    value: 'POST',
    label: <span className="text-yellow-600 font-semibold">POST</span>
  },
  {
    value: 'PUT',
    label: <span className="text-blue-400 font-semibold">PUT</span>
  },
  {
    value: 'PATCH',
    label: <span className="text-orange-40000 font-semibold">PATCH</span>
  },
  {
    value: 'DELETE',
    label: <span className="text-red-600 font-semibold">DELETE</span>
  }
]

const CreateApiTab = (props: { api: any; tabIndex: string; create: boolean }) => {
  const { token } = theme.useToken()

  const handleUrlChange = (e: any) => {
    const api: Api = JSON.parse(JSON.stringify(props.api))

    if (!api.request.url) api.request.url = {}

    const urlParts = e.target.value?.split('?', 2)
    api.request.url.raw = urlParts[0]

    if (urlParts.length === 2) {
      api.request.url.raw = `${urlParts[0]}`

      const queryString = urlParts[1]
      const queryParams = queryString.split('&')

      const parsedParams: any = []

      for (const queryParam of queryParams) {
        const keyValue = queryParam.split('=')
        const key = keyValue[0]
        const value = keyValue[1]

        const parsedParam = {
          key: key,
          value: value,
          description: '',
          disabled: false,
          default: false
        }
        parsedParams.push(parsedParam)
      }
      api.request.url.query = parsedParams
    } else {
      api.request.url.query = []
    }

    store.dispatch(updateApi(api))
  }

  const handleStatusCodeChange = (e: any) => {
    const api: Api = JSON.parse(JSON.stringify(props.api))
    api.defaultStatusCode = e.target.value
    store.dispatch(updateApi(api))
  }

  return (
    <div className="flex flex-grow flex-col p-3">
      <div className="flex items-start space-x-4">
        <Space.Compact className="w-full mb-3">
          <Select
            size="large"
            className="w-[10%]"
            defaultValue={props.api.request.method}
            options={requestOptions}
          />
          <Input
            size="large"
            className="!text-sm"
            value={`${props.api.request.url?.raw ? `${props.api.request.url.raw}` : ''}${
              props.api.request.url?.query?.length &&
              props.api.request.url.query.filter((q: any) => !q.disabled).length
                ? '?'
                : ''
            }${
              props.api.request.url?.query?.length
                ? `${props.api.request.url.query
                    .filter((query) => !query?.disabled)
                    .map((query) => {
                      if (
                        query?.value !== undefined &&
                        !query?.key?.length &&
                        !query?.value?.length
                      )
                        return null
                      return `${encodeURIComponent(query?.key || '')}${query?.value !== undefined ? '=' : ''}${encodeURIComponent(query?.value || '')}`
                    })
                    .filter((value) => value !== null)
                    .join('&')}`
                : ''
            }`}
            onChange={(e) => {
              handleUrlChange(e)
            }}
            placeholder="Enter an URL"
          />
        </Space.Compact>
        {props.api.type === TabTypes.CREATE_API && (
          <Popover content={'Save this api to start sending request'}>
            <Button disabled={true} size="large" type="primary" className="!font-semibold">
              Send
            </Button>
          </Popover>
        )}
        {props.api.type === TabTypes.API && (
          <Button size="large" type="primary" className="!font-semibold">
            Send
          </Button>
        )}
      </div>
      <div className="!max-h-[500px] !h-[300px]">
        <Tabs
          size="small"
          className="!ml-1"
          defaultActiveKey="1"
          items={[
            {
              label: (
                <span>
                  Params
                  {props.api.request.url?.query?.length ? (
                    <span
                      style={{
                        color: token.colorPrimary
                      }}
                      className="font-semibold"
                    >{` (${props.api.request.url?.query.filter((value: any) => !value.disabled).length})`}</span>
                  ) : (
                    ''
                  )}
                </span>
              ),
              key: '1',
              children: <QueryParamForm api={props.api} />
            },
            {
              label: (
                <span>
                  Headers
                  {props.api.request.header.length ? (
                    <span
                      style={{
                        color: token.colorPrimary
                      }}
                      className="font-semibold"
                    >{` (${props.api.request.header.filter((value: any) => !value.disabled).length})`}</span>
                  ) : (
                    ''
                  )}
                </span>
              ),
              key: '2',
              children: <RequestHeaderForm api={props.api} />
            },
            {
              label: 'Body',
              key: '3',
              children: <RequestBodyForm api={props.api} />
            }
          ]}
        />
      </div>
      <div className="flex-grow border-t relative">
        <Tabs
          size="small"
          className="!ml-1"
          defaultActiveKey="1"
          items={[
            {
              label: 'Body',
              key: '1',
              children: <ResponseBodyForm api={props.api} />
            }
          ]}
        />
        <div className="absolute right-0 w-[200px] top-2 flex items-center space-x-2">
          <div className="mr-2 text-gray-500 font-semibold">Status Code</div>
          {props.api.type !== TabTypes.API_RESPONSE && props.api.type !== TabTypes.CREATE_API ? (
            <div></div>
          ) : (
            <Input
              value={props.api.response?.code || undefined}
              onChange={(e) => handleStatusCodeChange(e)}
              type="number"
              className={`!w-[50%] !p-0 !px-2 !m-0 rounded-sm`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateApiTab