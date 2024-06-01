import { Api } from '@renderer/app/interfaces/models'
import store from '@renderer/app/store'
import { updateApi } from '@renderer/app/store/mock/tabSlice'
import { Checkbox, Input } from 'antd'
import { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'

const defaultParam = {
  key: '',
  value: '',
  description: '',
  disabled: false,
  default: true
}

const QueryParamForm = (props: { api: Api }) => {
  const [params, setParams]: any = useState(() => {
    const _params = props.api.request.url?.query ? props.api.request.url.query : []
    return [..._params, defaultParam]
  })
  const [hoverIndex, setHoverIndex] = useState(-1)

  const handleChange = (e: any, index: number) => {
    const newParams: any = [...JSON.parse(JSON.stringify(params))]

    newParams[index][e.target.name] = e.target.value
    newParams[index].default = false
    newParams[index].disabled = false

    if (index === newParams[index].index) {
      newParams.push({
        ...defaultParam,
        index: index + 1
      })
    }

    const api: Api = JSON.parse(JSON.stringify(props.api))
    if (!api.request.url) api.request.url = {}
    api.request.url.query = newParams.filter((params: any) => !params.default)
    store.dispatch(updateApi(api))
  }

  const deleteParam = (index) => {
    const newParams: any = [...JSON.parse(JSON.stringify(params))]
    newParams.splice(index, 1)

    const api: Api = JSON.parse(JSON.stringify(props.api))
    if (!api.request.url) api.request.url = {}
    api.request.url.query = newParams.filter((params: any) => !params.default)
    store.dispatch(updateApi(api))
    setParams(() => newParams)
  }

  useEffect(() => {
    setParams(() => {
      const _params = props.api.request.url?.query ? props.api.request.url.query : []
      return [..._params, defaultParam]
    })
  }, [props.api])

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <h2 className="text-gray-500 font-semibold mb-2 ml-1">Query Params</h2>
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
                  visibility: params.find((p) => !p.default) ? 'visible' : 'hidden'
                }}
              />
            </th>
            <th>Key</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param: any, index: number) => {
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
                <td className="text-left pl-[11px]">
                  {!param.default && <Checkbox checked={!param.disabled} />}
                </td>
                <td>
                  <Input
                    key={index}
                    name="key"
                    className="!border-none hover:bg-gray-100 focus:bg-gray-100 !rounded-none"
                    value={param.key}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                </td>
                <td>
                  <Input
                    key={index}
                    name="value"
                    className="!border-none hover:bg-gray-100 focus:bg-gray-100 !rounded-none"
                    value={param.value}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                </td>
                <td className="relative">
                  <Input
                    key={index}
                    name="description"
                    className="!border-none hover:bg-gray-100 focus:bg-gray-100 !rounded-none"
                    value={param.description}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                  {!param.default && hoverIndex === index && (
                    <div
                      onClick={() => deleteParam(index)}
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

export default QueryParamForm
