import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-beautify'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-text'
import ace from 'ace-builds/src-noconflict/ace'

import { TabTypes } from '@renderer/utilities/TabTypes'
import store from '@renderer/app/store'
import { updateApi } from '@renderer/app/store/mock/tabSlice'
import { useRef } from 'react'

import _ from 'lodash'

ace.config.set('workerPath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12')

const ResponseBodyForm = (props: { api: any }) => {
  const _api = JSON.parse(JSON.stringify(props.api))

  const editorRef: any = useRef(null)

  const setRequestBody = (value: any) => {
    const api: any = JSON.parse(JSON.stringify(props.api))
    api.response.body = value

    api.modified = !_.isEqual(api, _api)

    store.dispatch(updateApi(api))
  }

  return (
    <AceEditor
      ref={editorRef}
      mode={
        props.api.type === TabTypes.CREATE_API ||
        props.api.type === TabTypes.CREATE_API_RESPONSE ||
        props.api.type === TabTypes.API_RESPONSE
          ? props.api.request.body?.options?.raw.language
          : props.api.type === TabTypes.API
            ? props.api.response.mode === 'none'
              ? 'text'
              : props.api.response.options?.raw.language
            : 'json'
      }
      theme="twilight"
      onChange={(value) => {
        if (props.api.type !== TabTypes.API) {
          setRequestBody(value)
        }
      }}
      fontSize={12}
      name="response_code_editor"
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="100%"
      showPrintMargin={false}
      readOnly={
        props.api.type !== TabTypes.API_RESPONSE &&
        props.api.type !== TabTypes.CREATE_API &&
        props.api.type !== TabTypes.CREATE_API_RESPONSE
      }
      value={props.api.response?.body}
    />
  )
}

export default ResponseBodyForm
