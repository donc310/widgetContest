import Api from "./Api";
const resource = "/leveloptions";

export default {
get(){
    return Api.get(`${resource}`);
},
getcat(location){
    return Api.get(`${resource}?location=${location}`);
},
getsubcat(location ,cat){
    return Api.get(`${resource}?location=${location}&level=${cat}`);

}
};