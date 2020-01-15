import axios = require("axios");
const querysting = require("querystring")
import { AxiosStatic } from "axios"

const port = process.env.PORT || 4000;

const axiosStatic:AxiosStatic = axios.default;

axiosStatic.post(`https://online-conference-heroku.herokuapp.com/create_conf`, querysting.stringify({ confName: 'test-conf1' }) )
    .then((res) =>{
        console.log( res.data);
    }).then( res => {

    axiosStatic.get("https://online-conference-heroku.herokuapp.com/conf_list")
        .then((res) => {
            console.log(res.data);
        });
})


