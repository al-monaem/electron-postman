import { theme } from 'antd'
import Login from './Login'
import { useEffect, useState } from 'react'
import Register from './Register'
import { useAnimate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Auth = () => {
  const { token } = theme.useToken()
  const [scope, animate] = useAnimate()

  const accessToken = useSelector((state: any) => state.userReducer.accessToken)
  const navigate = useNavigate()
  const [selectedForm, setSelectedForm] = useState('login')

  useEffect(() => {
    if (selectedForm === 'register') {
      animate(scope.current, { x: '0%' }, { duration: 1 })
    } else {
      animate(scope.current, { x: '110%' }, { duration: 1 })
    }
  }, [selectedForm])

  useEffect(() => {
    if (accessToken) navigate('/')
  }, [accessToken])

  return (
    <div
      style={{
        backgroundColor: token.colorPrimaryBg
      }}
      className="w-screen h-screen flex items-center justify-center"
    >
      <div
        className={`w-[80vw] h-[60vh] md:w-[50vw] md:h-[45vh] rounded-md flex items-center shadow-sm shadow-[#3b4252] relative overflow-hidden`}
      >
        <Login setSelectedForm={setSelectedForm} selectedForm={selectedForm} />
        <Register scope={scope} setSelectedForm={setSelectedForm} selectedForm={selectedForm} />
      </div>
    </div>
  )
}

export default Auth
