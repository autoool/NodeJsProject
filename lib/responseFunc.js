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

    renderApiPageData(res,resCode,message,data={},pageInfo){
        let sendData={
            status:resCode,
            message:message,
            serverTime:(new Date()).getTime(),
            data:data,
            pageInfo:pageInfo
        }    
        return sendData;
    },

    renderApiErr(res,resCode,message){
        let errData={
            status:resCode,
            message:message,
            serverTime:(new Date()).getTime(),
            data:{},
            pageInfo:{}
        }    
        return errData;
    }
}
module.exports = responseFunc;

