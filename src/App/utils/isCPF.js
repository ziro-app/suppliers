const isCPF = (value) => {
    const outString = value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_').replaceAll('_', '');
    if(outString.length <= 12){
        return true
    }
        return false
}

export default isCPF