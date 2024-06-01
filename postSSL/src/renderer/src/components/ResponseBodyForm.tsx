import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/theme-github'
import ace from 'ace-builds/src-noconflict/ace'
import { TabTypes } from '@renderer/utilities/TabTypes'
import store from '@renderer/app/store'
import { updateApi } from '@renderer/app/store/mock/tabSlice'
ace.config.set('workerPath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12')

const ResponseBodyForm = (props: { api: any }) => {
  const setRequestBody = (value: any) => {
    const api: any = JSON.parse(JSON.stringify(props.api))
    api.response.body = value
    store.dispatch(updateApi(api))
  }

  return (
    <AceEditor
      mode={
        props.api.type === TabTypes.CREATE_API
          ? props.api.request.body?.options?.raw.language
          : 'json'
      }
      theme="github"
      onChange={(value) => setRequestBody(value)}
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
      value={props.api.response?.body || ''}
    />
  )
}

export default ResponseBodyForm
