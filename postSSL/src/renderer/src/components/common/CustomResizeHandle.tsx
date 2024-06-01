import React from 'react'

const CustomResizeHandle = React.forwardRef(({ handleAxis }: any, ref: any) => {
  return <div ref={ref} className={`custom-handle custom-handle-${handleAxis} border-r`} />
})

export default CustomResizeHandle
