import axios from 'axios'

const sendWhats = async (msg, celular) => {
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
                Authorization:process.env.ZAPBOX_ZIRO_TOKEN
            }
        }
        const result = await axios(options)
        return result
    } catch (error) {
        console.log(error.response)
    }
}

export default sendWhats