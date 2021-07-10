import React from "react"
import useDeviceSize from "@bit/ziro.utils.use-device-size"
import Button from "@bit/ziro.views.button"
import Icon from "@bit/ziro.views.icon2"
import { container, btn, btnDelete } from "./styles"

type Props = {
  handleClickDelete: () => void
  isLoading?: boolean
}

const DeleteAndSubmitButtons = ({ handleClickDelete, isLoading }: Props) => {
  const device = useDeviceSize()
  const isMobile = device === "smallMobile"
  const btnDeleteProps = { onClick: handleClickDelete, isLoading }
  return (
    <div style={container}>
      <Button type="button" {...btnDeleteProps} buttonStyle="destructive" style={btnDelete}>
        <Icon featherName="Trash" width={isMobile ? 16 : 18} height={isMobile ? 16 : 18} />
      </Button>
      <Button type="submit" isLoading={isLoading} style={btn}>
        Salvar produto
      </Button>
    </div>
  )
}

export default DeleteAndSubmitButtons
