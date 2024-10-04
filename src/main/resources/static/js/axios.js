async function addPatient(patientObj) {
    const response = await axios.post(`/patient_register/`, patientObj)
    console.log("44444440->" + response)
    return response.data.patientRegister;
}

async function patientSearch(keyword) {
    const response = await axios.post(`/patient_search/`, keyword)
    console.log(response)
    return response.data.result;
}

async function removePatient(chartNum) {
    const response = await axios.delete(`/patient_register/remove/${chartNum}`)
    console.log(response)
    return response.data.result;
}

async function modifyPatient(patientObj,chartnum) {
    console.log("222222->" + patientObj.toString())
    const response = await axios.put(`/patient_register/modify/${chartnum}`, patientObj)
    console.log(response)
    return response.data.patientRegister;
}
