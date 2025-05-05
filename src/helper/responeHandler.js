const ResponseHandler = (error, data, response) => {
    let res = {
        code: data.code || 200,
        status: error == null ? "success" : "failed",
        message: data.message || '',
        data: data.data || [],
        error: error || null
    }
    return response.json(res);
}
const ResponseObject = {
    code: 200,
    message: '',
    data: [],
    error: null
}
module.exports = { ResponseHandler, ResponseObject };