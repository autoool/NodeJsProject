var responseFunc={
    renderApiData(res,resCode,message,data={}){
        let sendData={
            status:resCode,
            message:message,
            serverTime:(new Date()).getTime(),
            data
        }    
        return sendData;
    },

    renderApiErr(res,resCode,message){
        let errData={
            status:resCode,
            message:message,
            serverTime:(new Date()).getTime(),
            data:{}
        }    
        return errData;
    }
}
module.exports = responseFunc;

