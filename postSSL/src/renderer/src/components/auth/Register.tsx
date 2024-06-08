import { useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, theme } from 'antd'
import { motion } from 'framer-motion'
import { register } from '@renderer/controllers/auth.controller'
import moment from 'moment'

import _0 from '@renderer/assets/svg/0.svg'
import _2 from '@renderer/assets/svg/2.svg'
import _6 from '@renderer/assets/svg/6.svg'
import _404 from '@renderer/assets/svg/404.svg'

const initialSvgFiles = [
  { svg: _0, posX: -30, posY: 20, rotation: 45 },
  { svg: _2, posX: 50, posY: -20, rotation: 0 },
  { svg: _6, posX: 60, posY: 70, rotation: 90 },
  { svg: _0, posX: 150, posY: 50, rotation: 135 },
  { svg: _2, posX: 250, posY: 40, rotation: 180 },
  { svg: _6, posX: 210, posY: 140, rotation: 225 },
  { svg: _0, posX: 40, posY: 180, rotation: 270 },
  { svg: _0, posX: 150, posY: 200, rotation: 315 },
  { svg: _2, posX: -20, posY: 260, rotation: 0 },
  { svg: _0, posX: 80, posY: 300, rotation: 90 },
  { svg: _6, posX: 180, posY: 280, rotation: 45 },
  { svg: _0, posX: 250, posY: 350, rotation: 135 }
]

const Register = ({ scope, setSelectedForm, selectedForm }) => {
  const registerFormRef = useRef<HTMLDivElement>(null)
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [svgFiles, setSvgFiles]: any = useState([])

  const handleRegister = async (values: any) => {
    const status = await register({
      ...values,
      date_of_birth: moment(values.date_of_birth) || null
    })

    if (status === 200) setSelectedForm('login')
  }

  useEffect(() => {
    if (registerFormRef.current) {
      const divWidth = registerFormRef.current.clientWidth
      const divHeight = registerFormRef.current.clientHeight

      const scaledSvgFiles = initialSvgFiles.map((file) => ({
        ...file,
        posX: (file.posX / 300) * divWidth, // Scale X based on the form's width
        posY: (file.posY / 400) * divHeight // Scale Y based on the form's height
      }))

      setSvgFiles(scaledSvgFiles)
    }
  }, [registerFormRef.current])

  useEffect(() => {
    form.resetFields()
  }, [selectedForm])

  return (
    <motion.div
      ref={scope}
      initial={{
        x: '110%'
      }}
      style={{
        backgroundColor: token.colorBgContainer
      }}
      className="w-full h-full flex items-center overflow-hidden absolute z-10"
    >
      <div className="w-[30%] flex items-center justify-center flex-col">
        <img className="w-full" src={_404} />
        <div className="mt-3 flex flex-col items-center space-y-3 mb-8">
          <div
            style={{
              color: token.colorTextSecondary
            }}
          >
            Already have an account?
          </div>
          <Button onClick={() => setSelectedForm('login')} type="primary">
            Log In!
          </Button>
        </div>
      </div>
      <div
        ref={registerFormRef}
        className="relative w-[70%] h-full overflow-hidden px-8 pb-8 flex justify-center"
      >
        {svgFiles.map((file, index) => (
          <img
            key={index}
            src={file.svg}
            alt={`svg-${index}`}
            style={{
              position: 'absolute',
              left: `${file.posX}px`,
              top: `${file.posY}px`,
              width: '64px',
              height: '64px',
              transform: `rotate(${file.rotation}deg)`,
              zIndex: 1
            }}
          />
        ))}
        <Form
          layout="vertical"
          labelCol={{
            style: {
              fontWeight: 600
            }
          }}
          form={form}
          className="relative w-full overflow-hidden"
          style={{
            zIndex: 2
          }}
          onFinish={handleRegister}
        >
          <h2 className="text-center">Join Us!</h2>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={'USERNAME'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!'
                  }
                ]}
                className="w-full"
                name={'username'}
              >
                <Input placeholder="johndoe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'EMAIL'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!'
                  }
                ]}
                className="w-full"
                name={'email'}
              >
                <Input type="email" placeholder="john@doe.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={'EMPLOYEE ID'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your employee id!'
                  }
                ]}
                className="w-full"
                name={'emp_id'}
              >
                <InputNumber className="!w-full" type="number" min={1} placeholder="john@doe.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item className="!w-full" label={'DATE OF BIRTH'} name={'date_of_birth'}>
                <DatePicker className="!w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={'PASSWORD'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password!'
                  }
                ]}
                className="w-full"
                name={'password'}
              >
                <Input type="password" placeholder="********" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'CONFIRM PASSWORD'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password!'
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error('The new password that you entered do not match!')
                      )
                    }
                  })
                ]}
                dependencies={['password']}
                className="w-full"
                name={'confirm_password'}
              >
                <Input type="password" placeholder="********" />
              </Form.Item>
            </Col>
          </Row>

          <Button htmlType="submit" type="primary" className="w-full !font-semibold">
            Register
          </Button>
        </Form>
      </div>
    </motion.div>
  )
}

export default Register
