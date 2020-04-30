import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { dropzone, instructions, button, input, styleTag } from './styles'

const ImageUpload = ({ setFile, indexOfFile, persistFilename }) => {
    const [filename, setFilename] = useState(persistFilename ? persistFilename : '')

    const handleDragEnter = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragLeave = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragOver = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDrop = async e => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files[0]
        setFilename(file.name)
        setFile(file)
    }
    const handleChange = async e => {
        const file = e.target.files[0]
        setFilename(file.name)
        setFile(file)
    }
    return (
        <div
            style={dropzone}
            className='dropzone'
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onChange={handleChange}
        >
            <style>{styleTag}</style>
            <label style={instructions}>{filename ? filename : 'Arraste imagens ou escolha do dispositivo'}</label>
            <motion.label
                style={button}
                htmlFor={`input-file${indexOfFile}`}
                whileTap={{ scale: 0.95 }}
            >Escolher
			</motion.label>
            <input
                style={input}
                id={`input-file${indexOfFile}`}
                type='file'
            />
        </div>
    )
}

ImageUpload.propTypes = {
    setFile: PropTypes.func,
    indexOfFile: PropTypes.number,
    persistFilename: PropTypes.string
}

export default ImageUpload