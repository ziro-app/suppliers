import React from 'react'
import ToastNotification from '@bit/vitorbarbosa19.ziro.toast-notification'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import { successColor, warningColor } from '@ziro/theme'
import { labelStyle, toastStyle } from './styles'

export default ({ openToastRoot, setOpenToastRoot, messageToastRoot, type }) => {
  return (
    <ToastNotification isOpen={openToastRoot} setIsOpen={setOpenToastRoot} boxStyle={toastStyle}>
      <Icon type={type === 'alert' ? 'alert' : 'warning'} color={type === 'alert' ? successColor : warningColor} />
      <label style={labelStyle}>{messageToastRoot}</label>
    </ToastNotification>
  )
}
