import axios = require("axios");
const querysting = require("querystring")

import {AxiosStatic, AxiosResponse} from "axios"

const axiosStatic:AxiosStatic = axios.default;


// axiosStatic.get("http://localhost:3000/conf_list")
//     .then((res) => {
//         console.log(res.data);
//     });

axiosStatic.post("http://localhost:3000/create_conf", querysting.stringify({ conf: 'test-conf1' }) )
    .then((res) =>{
        console.log( res.data);
    });
