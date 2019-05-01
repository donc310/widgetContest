import axios from "axios";
const baseDomain = "https://contestendpoint.herokuapp.com";
const baseURL = `${baseDomain}/api`;
export default axios.create({
baseURL
});
