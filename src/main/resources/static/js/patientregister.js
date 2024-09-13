console.log("reply 시작")

async function addReply(patientObj) {
    const response = await axios.post(`/patient_register/`, patientObj)
    return response.data.patientRegister;
}