import StatesApi from "./StatesApi";
import LevelsAPi from "./LevelsApi";
import QueryApi  from "./QueryApi";

const endpoints = {
states: StatesApi,
levels:LevelsAPi,
query:QueryApi
};
export const ApiFactory = {
get: name => endpoints[name]
};