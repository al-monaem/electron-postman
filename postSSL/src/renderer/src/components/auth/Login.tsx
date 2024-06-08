import { Button, Form, Input, theme } from 'antd'
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import _0 from '@renderer/assets/svg/0.svg'
import _2 from '@renderer/assets/svg/2.svg'
import _6 from '@renderer/assets/svg/6.svg'
import _accept from '@renderer/assets/svg/accept.svg'
import { login } from '@renderer/controllers/auth.controller'

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

const Login = ({ setSelectedForm, selectedForm }) => {
  const [svgFiles, setSvgFiles]: any = useState([])
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const loginFormRef = useRef<HTMLDivElement>(null)

  const handleLogin = async (values) => {
    await login(values)
  }

  useEffect(() => {
    if (loginFormRef.current) {
      const divWidth = loginFormRef.current.clientWidth
      const divHeight = loginFormRef.current.clientHeight

      const scaledSvgFiles = initialSvgFiles.map((file) => ({
        ...file,
        posX: (file.posX / 300) * divWidth, // Scale X based on the form's width
        posY: (file.posY / 400) * divHeight // Scale Y based on the form's height
      }))

      setSvgFiles(scaledSvgFiles)
    }
  }, [loginFormRef.current])

  useEffect(() => {
    form.resetFields()
  }, [selectedForm])

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer
      }}
      className="w-full h-full flex items-center"
    >
      <div
        ref={loginFormRef}
        className="relative w-[60%] h-full overflow-hidden px-8 flex justify-center"
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
          form={form}
          layout="vertical"
          labelCol={{
            style: {
              fontWeight: 600
            }
          }}
          className="relative w-full"
          style={{
            zIndex: 2
          }}
          onFinish={handleLogin}
        >
          <h2 className="text-center">Welcome Back!</h2>
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
          <div className="mb-4 text-xs">
            <Link to={'#'}>Forgot Password?</Link>
          </div>

          <Button htmlType="submit" type="primary" className="w-full !font-semibold">
            Log In
          </Button>
        </Form>
      </div>
      <div className="w-[40%] flex items-center justify-center flex-col">
        <img className="w-full" src={_accept} />
        <div className="mt-3 flex flex-col items-center space-y-3 mb-8">
          <div
            style={{
              color: token.colorTextSecondary
            }}
          >
            Don't have an account?
          </div>
          <Button onClick={() => setSelectedForm('register')} type="primary">
            Join Us!
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
