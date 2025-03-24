import axios from "axios";
const rest_url = "http://localhost:8080/api/hello";
export const message = () => {
 return axios.get(rest_url);
}