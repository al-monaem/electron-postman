import '@renderer/assets/request-form.css'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-github'

import { Api } from '@renderer/app/interfaces/models'
import store from '@renderer/app/store'
import { updateApi } from '@renderer/app/store/mock/tabSlice'
import { Radio, Select } from 'antd'

import useDebounce from '@renderer/hooks/useDebounce'
import { useEffect, useState } from 'react'

import * as _ from 'lodash'
import { useSelector } from 'react-redux'

const { Option } = Select

const RequestBodyForm = (props: { api: Api }) => {
  const [requestBody, setRequestBody] = useState(props.api.request.body?.raw || '')
  const requestBodyDebouncedValue = useDebounce(requestBody, 1000)
  const activeTheme = useSelector((state: any) => state.settingsReducer.activeTheme)

  const handleModeChange = (e: any) => {
    const api: Api = JSON.parse(JSON.stringify(props.api))
    if (!api.request.body)
      api.request.body = {
        mode: 'none'
      }

    api.request.body.mode = e.target.value
    if (e.target.value === 'raw')
      api.request.body.options = {
        raw: {
          language: 'json'
        }
      }
    // api.modified = !_.isEqual(api, _api)
    api.modified = true
    store.dispatch(updateApi(api))
  }

  const handleLanguageChange = (value: string) => {
    const api: any = JSON.parse(JSON.stringify(props.api))

    if (!api.request.body)
      api.request.body = {
        mode: 'raw'
      }
    api.request.body.options = {
      raw: {
        language: value
      }
    }

    api.request.header = api.request.header.map((header: any) => {
      if (header.key === 'Content-Type') {
        header.value = value === 'xml' ? 'application/xml' : 'application/json'
      }
      return header
    })

    // api.modified = !_.isEqual(api, _api)
    api.modified = true
    store.dispatch(updateApi(api))
  }

  useEffect(() => {
    const api: Api = JSON.parse(JSON.stringify(props.api))
    if (!api.request.body) {
      api.request.body = {
        mode: 'none'
      }
    }

    api.request.body.raw = requestBodyDebouncedValue

    // api.modified = !_.isEqual(api, _api)
    api.modified = true

    store.dispatch(updateApi(api))
  }, [requestBodyDebouncedValue])

  return (
    <div className="flex flex-grow flex-col h-full">
      <div>
        <Radio.Group
          size="small"
          value={props.api.request.body?.mode}
          onChange={(e) => handleModeChange(e)}
        >
          <Radio value={'none'}>none</Radio>
          <Radio disabled value={'form-data'}>
            form-data
          </Radio>
          <Radio value={'raw'}>raw</Radio>
        </Radio.Group>
        {props.api.request.body?.mode === 'raw' && (
          <Select
            onChange={(value) => handleLanguageChange(value)}
            value={props.api.request.body?.options?.raw.language}
            size="small"
            className="raw-language"
          >
            <Option value={'json'}>JSON</Option>
            <Option value={'xml'}>XML</Option>
          </Select>
        )}
      </div>
      <div className="flex flex-grow border mt-2 h-full">
        {props.api.request.body?.mode === 'raw' && (
          <AceEditor
            mode={props.api.request.body?.options?.raw.language}
            theme={activeTheme === 'dark' ? 'twilight' : 'github'}
            onChange={(value) => setRequestBody(value)}
            fontSize={12}
            name="request_code_editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
            showPrintMargin={false}
            value={requestBody}
          />
        )}
      </div>
    </div>
  )
}

export default RequestBodyForm
