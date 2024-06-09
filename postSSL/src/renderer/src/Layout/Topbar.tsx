import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Dropdown, theme } from 'antd'
import { RiMenuUnfoldFill } from 'react-icons/ri'
import { CiLogout, CiUnlock } from 'react-icons/ci'
import { HiMiniSun } from 'react-icons/hi2'
import { GiNightSleep } from 'react-icons/gi'
import { AnimatePresence, motion } from 'framer-motion'
import { switchTheme } from '@renderer/app/store/user/settingsSlice'
import store from '@renderer/app/store'

import dark from '@renderer/assets/dark.jpg'
import light from '@renderer/assets/light.jpg'

const TopBar = () => {
  const activeTheme = useSelector((state: any) => state.settingsReducer.activeTheme)
  const user = useSelector((state: any) => state.userReducer.user)

  const handleSwitchTheme = () => {
    store.dispatch(switchTheme())
  }

  const { token } = theme.useToken()

  const [menuVisible, setMenuVisible] = useState(false)
  // const [isPasswordModalOpen, setPasswordModalOpen] = useState(false)

  // const handleMenuClick = ({ key }) => {
  //   if (key === 'changePassword') {
  //     setPasswordModalOpen(true)
  //   } else if (key === 'logout') {
  //     logout()
  //   }
  // }

  const items = [
    {
      label: (
        <div className="flex items-center">
          <CiUnlock className="w-4 h-4 mr-2" />
          Change Password
        </div>
      ),
      key: 'changePassword'
    },
    {
      label: (
        <div className="flex items-center">
          <CiLogout className="w-4 h-4 mr-2" />
          Logout
        </div>
      ),
      key: 'logout'
    }
  ]

  return (
    <>
      <div className="flex w-full h-full items-center">
        <div className="ml-7">
          <h3 className="tracking-wider">Welcome, &nbsp;{user?.username}</h3>
        </div>
        <div className="ml-auto mr-10 flex space-x-4 items-center justify-center">
          <div
            style={{
              border: `1px solid ${token.colorBorder}`,
              borderRadius: '20px',
              backgroundColor: token.colorBgLayout,

              width: '100px'
            }}
            className="flex items-center relative overflow-hidden"
          >
            <AnimatePresence>
              <motion.div
                key={activeTheme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }} // Adjust transition duration as needed
                style={{
                  backgroundImage: activeTheme === 'dark' ? `url(${dark})` : `url(${light})`,
                  backgroundSize: '300px', // Add this property to zoom and cover the entire container
                  backgroundPosition: 'center center', // Center the background image
                  width: '100%',
                  height: '100%',
                  position: 'absolute'
                }}
              />
            </AnimatePresence>
            <motion.div
              initial={{ x: activeTheme === 'dark' ? 57 : 0 }}
              animate={{ x: activeTheme === 'dark' ? 57 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: token.colorPrimary
                }}
                className="flex items-center shadow-gray-500 shadow-lg justify-center rounded-full m-1"
                icon={
                  activeTheme === 'dark' ? (
                    <GiNightSleep className="hover:font-semibold w-7 h-7" />
                  ) : (
                    <HiMiniSun className="hover:font-semibold w-7 h-7" />
                  )
                }
                onClick={() => handleSwitchTheme()}
              />
            </motion.div>
          </div>

          <Dropdown
            className=""
            menu={{
              items
              // onClick: handleMenuClick
            }}
            trigger={['click']}
            open={menuVisible}
            onOpenChange={setMenuVisible}
          >
            <Button
              size="large"
              type={`${menuVisible ? 'primary' : 'default'}`}
              className={`rounded-full flex items-center justify-center ${
                menuVisible ? 'rotate-90 rounded-r-none' : 'rotate-0'
              }`}
              icon={<RiMenuUnfoldFill className="w-5 h-5" />}
            />
          </Dropdown>
        </div>
      </div>
      {/* {isPasswordModalOpen && (
        <ChangePassword
          isPasswordModalOpen={isPasswordModalOpen}
          setPasswordModalOpen={setPasswordModalOpen}
        />
      )} */}
    </>
  )
}

export default TopBar
