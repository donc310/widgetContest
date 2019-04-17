import Api from "./Api";
const resource = "/leveloptions";

export default {
get(){
    return Api.get(`${resource}`);
},
getLevel(levelId){
    return Api.get(`${resource}/${levelId}`);
},
};