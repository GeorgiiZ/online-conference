import axios = require("axios");
const querysting = require("querystring")
import { AxiosStatic } from "axios"

const axiosStatic:AxiosStatic = axios.default;

axiosStatic.post("http://localhost:3000/create_conf", querysting.stringify({ confName: 'test-conf1' }) )
    .then((res) =>{
        console.log( res.data);
    }).then( res => {

    axiosStatic.get("http://localhost:3000/conf_list")
        .then((res) => {
            console.log(res.data);
        });
})


