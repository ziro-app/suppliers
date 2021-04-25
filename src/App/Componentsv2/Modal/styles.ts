import { MotionProps } from "framer-motion"

export const overlay: React.CSSProperties = {
  zIndex: 1,
  position: "fixed",
  top: "0",
  left: "0",
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
  width: "100%",
  height: "100vh",
  boxSizing: "border-box",
  overflow: "hidden",
  background: "rgba(34,34,34,0.2)",
}

export const container: React.CSSProperties = {
  position: "relative",
  maxWidth: "350px",
  width: "90%",
  margin: "0 auto",
  padding: "20px 20px 30px",
  boxSizing: "border-box",
  borderRadius: "3px",
  background: "white",
  boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10),
	1px 0px 8px 0px rgba(34,34,34,0.05)`,
}

export const closeButton: React.CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "10px",
}

export const overlayAnimation: MotionProps = {
  transition: { type: "spring", damping: 32, stiffness: 450 },
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const containerAnimation: MotionProps = {
  transition: { type: "spring", damping: 32, stiffness: 320 },
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
}
