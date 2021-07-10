import { primaryColor, secondaryColor, grayColor2, fontTitle, gradient } from "@ziro/theme"

export const brandCart = {
  display: "grid",
  gridGap: "20px",
}

export const brandName = {
  marginBottom: "-20px",
  padding: "10px 0",
  fontFamily: fontTitle,
  fontSize: "20px",
  textAlign: "center",
}

export const cardBlock = {
  display: "grid",
  gridTemplateColumns: "80px 1fr",
  alignItems: "end",
  padding: "20px 10px",
  borderRadius: "3px",
  boxShadow: "rgba(34, 34, 34, 0.3) 0px 5px 10px -1px",
}

export const image = {
  alignSelf: "start",
  objectFit: "cover",
  width: "100%",
  borderRadius: "3px",
}

export const cardText = {
  display: "grid",
  alignItems: "center",
  gridRowGap: "15px",
  padding: "0 0 0 15px",
}

export const icon = {
  alignSelf: "center",
  justifySelf: "end",
  display: "grid",
  justifyItems: "center",
  alignItems: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "white",
  boxShadow: "rgba(34, 34, 34, 0.3) 0px 5px 10px -1px",
}

export const orderStatus = status => ({
  fontFamily: fontTitle,
  textAlign: status ? "center" : "left",
  alignSelf: status ? "end" : "initial",
})

export const order = {
  display: "grid",
  gridRowGap: "2px",
}

export const orderTitle = {
  color: grayColor2,
  fontSize: "1.4rem",
  fontWeight: "500",
}

export const orderGrid = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
}

export const orderQty = {
  fontSize: "1.4rem",
}

export const button = {
  margin: "10px auto 0",
  display: "block", // necessary for link version
  WebkitAppearance: "none",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  MozAppearance: "none",
  outline: "none",
  cursor: "pointer",
  height: "30px",
  width: "100%",
  maxWidth: "200px",
  padding: "8px 0px",
  border: "none",
  borderRadius: "20px",
  fontFamily: fontTitle,
  fontSize: "1.3rem",
  color: "#FFF",
  textAlign: "center",
  background: gradient,
  boxShadow: `0px 3px 12px -3px rgba(34,34,34,0.65)`,
}

export const buttonDownload = {
  ...button,
  maxWidth: "none",
  height: "none",
  margin: "0",
  padding: "10px 0px",
  fontSize: "1.5rem",
  boxShadow: `0px 3px 12px -2px rgba(34,34,34,0.65)`,
}

export const card = {
  display: "grid",
  padding: "10px",
  background: "white",
  gridGap: "10px",
  boxShadow: "rgba(34, 34, 34, 0.3) 0px 5px 15px -4px",
}

export const content = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: "10px",
  alignItems: "center",
  borderTop: "1px solid #F0F0F0",
}

export const qtyLabel = {
  padding: "10px 10px",
  borderTop: "1px solid #F0F0F0",
  borderBottom: "1px solid #F0F0F0",
}

export const qtyContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr",
  alignItems: "center",
}

export const radioButtonContainer = {
  display: "flex",
  position: "relative",
}
export const priceLabel = {
  fontFamily: fontTitle,
  fontSize: "1.5rem",
}
export const editCardInputs = {
  display: "grid",
  gridRowGap: "3em",
  padding: "10px 10px 20px",
}
// .fileContainer .uploadPicturesWrapper
export const fileContainerUploadPicturesWrapperClass = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  width: "100%",
}
// .fileContainer .uploadPictureContainer
export const fileContainerUploadPictureContainerClass = {
  width: "100%",
  Display: "flex",
  AlignItems: "center",
  justifyContent: "center",
  height: "inherit",
  position: "relative",
  borderRadius: "5px",
  boxShadow: "rgba(34, 34, 34, 0.3) 0px 0px 15px -4px",
}
// .fileContainer .uploadPictureContainer img.uploadPicture
export const fileContainerUploadPictureContainerimgUploadPictureClass = {
  width: "100%",
}

/** Products styles */
export const centerInline = { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px" }
export const checkbox = {
  position: "relative",
  background: "#fff",
  borderRadius: "30%",
  cursor: "pointer",
  width: "12px",
  height: "12px",
  padding: "6px",
  boxShadow: "0px 2px 10px -4px #222",
}
export const gapBetweenFlexItems = {
  fontFamily: fontTitle,
  fontSize: "1.3rem",
  fontWeight: "500",
  paddingLeft: "5px",
  textTransform: "uppercase",
}
export const quantitiesStyle = { display: "grid", gridRowGap: "10px", padding: "0 0 0 5px", position: "relative" }
