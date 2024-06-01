import { Collection } from '@renderer/app/interfaces/models'
import store from '@renderer/app/store'
import { updateTabType } from '@renderer/app/store/mock/tabSlice'
import { createCollection, getCollections } from '@renderer/controllers/collection.controller'
import { TabTypes } from '@renderer/utilities/TabTypes'
import { Button, Form, Input, Popconfirm } from 'antd'
import { IoIosSave } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'

const { TextArea } = Input

const CreateCollectionTab = (props: {
  collection: Collection
  tabIndex: string
  create: boolean
}) => {
  const onFinish = async (values: any) => {
    const payload = {
      ...props.collection,
      ...values
    }

    const response = await createCollection(payload)
    if (response.status === 200) {
      const _payload: any = {
        tabIndex: props.tabIndex,
        type: TabTypes.COLLECTION,
        name: payload.name,
        description: payload.description
      }
      store.dispatch(updateTabType(_payload))

      await getCollections()
    }
  }

  const handleDelete = () => {}

  return (
    <div className="p-5 flex flex-grow">
      <Form onFinish={onFinish} layout="vertical" className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="m-0 p-0 text-2xl font-semibold mb-8 ml-1">
            {props.create && 'Create Collection'}
            {!props.create && props.collection.name}
          </h2>
          <div className="flex items-center space-x-2">
            {!props.create && (
              <Popconfirm
                title={'Are you sure to delete this collection?'}
                onConfirm={handleDelete}
                placement="bottom"
                okButtonProps={{
                  danger: true
                }}
              >
                <Button
                  className="!flex items-center justify-center"
                  icon={<MdDelete className="w-4 h-4" />}
                  danger
                />
              </Popconfirm>
            )}
            <Button
              type="primary"
              className="!flex items-center justify-center"
              htmlType="submit"
              icon={<IoIosSave className="w-4 h-4" />}
            >
              Save
            </Button>
          </div>
        </div>
        <Form.Item
          label={'Collection Name'}
          initialValue={props.collection.name}
          name={'name'}
          rules={[
            {
              required: true,
              message: 'Please enter your collection name!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'Description'}
          initialValue={props.collection.description}
          name={'description'}
        >
          <TextArea
            style={{
              minHeight: 100,
              maxHeight: 300
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateCollectionTab
