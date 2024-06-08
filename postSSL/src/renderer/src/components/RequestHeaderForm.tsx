import { Api } from '@renderer/app/interfaces/models'
import store from '@renderer/app/store'
import { updateApi } from '@renderer/app/store/mock/tabSlice'
import { Checkbox, Input } from 'antd'
import { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'

const defaultHeaders = {
  key: '',
  value: '',
  description: '',
  disabled: false,
  default: true
}

const RequestHeaderForm = (props: { api: Api }) => {
  const [headers, setHeaders]: any = useState(() => {
    const _headers = props.api.request.header ? props.api.request.header : []
    return [..._headers, defaultHeaders]
  })
  const [hoverIndex, setHoverIndex] = useState(-1)

  const handleChange = (e: any, index: number) => {
    const newHeaders: any = [...JSON.parse(JSON.stringify(headers))]

    newHeaders[index][e.target.name] = e.target.value
    newHeaders[index].default = false
    newHeaders[index].disabled = false

    if (index === newHeaders[index].index) {
      newHeaders.push({
        ...defaultHeaders,
        index: index + 1
      })
    }

    const api: Api = JSON.parse(JSON.stringify(props.api))
    api.request.header = newHeaders.filter((headers: any) => !headers.default)

    if (newHeaders[index].key?.toLowerCase() === 'content-type') {
      if (
        newHeaders[index].value?.toLowerCase() !== 'application/json' &&
        newHeaders[index].value?.toLowerCase() !== 'application/xml'
      ) {
        if (!api.request.body) api.request.body = { mode: 'none' }
        api.request.body.mode = 'none'
      } else {
        if (!api.request.body) api.request.body = { mode: 'raw' }
        if (newHeaders[index].value?.toLowerCase() === 'application/json') {
          api.request.body.mode = 'raw'
          api.request.body.options = {
            raw: {
              language: 'json'
            }
          }
        } else {
          api.request.body.mode = 'raw'
          api.request.body.options = {
            raw: {
              language: 'xml'
            }
          }
        }
      }
    }

    store.dispatch(updateApi(api))
  }

  const deleteHeader = (index: number) => {
    const newHeaders: any = [...JSON.parse(JSON.stringify(headers))]
    newHeaders.splice(index, 1)

    const api: Api = JSON.parse(JSON.stringify(props.api))
    api.request.header = newHeaders.filter((headers: any) => !headers.default)
    store.dispatch(updateApi(api))
    setHeaders(() => newHeaders)
  }

  useEffect(() => {
    setHeaders(() => {
      const _headers = props.api.request.header ? props.api.request.header : []
      return [..._headers, defaultHeaders]
    })
  }, [props.api])

  return (
    <div className="flex-grow flex flex-col">
      <h2 className="text-gray-500 font-semibold mb-2 ml-1">Request Headers</h2>
      <table
        style={{
          borderCollapse: 'collapse'
        }}
        className="border"
      >
        <thead>
          <tr>
            <th>
              <Checkbox
                style={{
                  visibility: headers.find((p) => !p.default) ? 'visible' : 'hidden'
                }}
              />
            </th>
            <th>Key</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header: any, index: number) => {
            return (
              <tr
                onMouseEnter={() => {
                  setHoverIndex(index)
                }}
                onMouseLeave={() => {
                  setHoverIndex(-1)
                }}
                key={index}
              >
                <td className="text-left pl-[11px]">{!header.default && <Checkbox />}</td>
                <td>
                  <Input
                    key={index}
                    name="key"
                    className="!border-none hover:bg-gray-100 focus:bg-gray-100 !rounded-none"
                    value={header.key}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                </td>
                <td>
                  <Input
                    key={index}
                    name="value"
                    className="!border-none hover:bg-gray-100 focus:bg-gray-100 !rounded-none"
                    value={header.value}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                </td>
                <td className="relative">
                  <Input
                    key={index}
                    name="description"
                    className="!border-none hover:bg-gray-100 focus:bg-gray-100 !rounded-none"
                    value={header.description}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                  {!header.default && hoverIndex === index && (
                    <div
                      onClick={() => deleteHeader(index)}
                      style={{
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="absolute z-10 right-0 top-[50%] text-gray-400 hover:cursor-pointer hover:text-red-400 transition"
                    >
                      <MdDelete className="w-4 h-4" />
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RequestHeaderForm
