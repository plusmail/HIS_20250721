console.log("reply 시작")

async function addReply(patientObj) {
    const response = await axios.post(`/patient_register/`, patientObj)
    console.log(response)
    return response.data.patientRegister;
}

async function patientSearch(keyword) {
    const response = await axios.post(`/patient_search/`, keyword)
    console.log(response)
    return response.data.result;
}

