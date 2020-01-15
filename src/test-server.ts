import axios = require("axios");
const querysting = require("querystring")
import { AxiosStatic } from "axios"

const port = process.env.PORT || 3000;

const axiosStatic:AxiosStatic = axios.default;

axiosStatic.post(`http://localhost:${ port }/create_conf`, querysting.stringify({ confName: 'test-conf1' }) )
    .then((res) =>{
        console.log( res.data);
    }).then( res => {

    axiosStatic.get("http://localhost:3000/conf_list")
        .then((res) => {
            console.log(res.data);
        });
})


