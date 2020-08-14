import axios from 'axios'

const sendWhats = async (state, action) => {
    const {msg, celular} = action.payload
    try {
        const options = {
            method:'GET',
            url:process.env.ZAPBOX_URL,
            params:{
                to:`55${celular}@c.us`,
                msg,
                zapBoxToken:process.env.ZAPBOX_TOKEN
            },
            headers:{
                Origin:'https://ziro.app',
                Authorization:process.env.ZAPBOX_ZIRO_TOKEN
            }
        }
        await axios(options)
        return {...state}
    } catch (error) {
        console.log(error.response)
    }
}

export default sendWhats