import React from "react"
import PropTypes from "prop-types"
import Header from "@bit/vitorbarbosa19.ziro.header"
import { containerWithPadding } from "@ziro/theme"

export const HeaderBack = ({ title, navigateTo, children, withoutContainer }) => {
  return (
    <div style={withoutContainer ? {} : containerWithPadding}>
      <Header type="icon-link" title={title} navigateTo={navigateTo} icon="back" />
      {children}
    </div>
  )
}

HeaderBack.propTypes = {
  title: PropTypes.string.isRequired,
  navigateTo: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.element)]).isRequired,
  withoutContainer: PropTypes.bool,
}
