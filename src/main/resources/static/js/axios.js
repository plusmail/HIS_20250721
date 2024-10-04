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

async function removePatient(chartNum) {
    console.log("222222->" + chartNum)
    const response = await axios.delete(`/patient_register/remove/${chartNum}`)
    console.log(response)
    return response.data.result;
}
