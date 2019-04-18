import Api from "./Api";
const resource = "/stats/query";
const queryString = require('query-string');

export default {
query(query){
    var param = {}
    param.Level_1 = query.Level1;
    param.Level_2 = query.Level2;
    param.audience = query.audience;
    param.name = query.name
    param.enableadvance = query.enableadvance
    var paramfrequency ={frequency:query.frequency};
    var paramStates = {states:query.stateTags};
    const x = queryString.stringify(param);
    const y = queryString.stringify(paramfrequency, {arrayFormat: 'comma'});
    const z = queryString.stringify(paramStates,{arrayFormat:'comma'});
    let s = "&"
    var _query = x;
    if (query.frequency.length >=1){
    _query = _query.concat(s).concat(y)
    }
    if(query.stateTags.length >= 1){
    _query = _query.concat(s).concat(z)
    }
    return Api.get(`${resource}?${_query}`);
},

};