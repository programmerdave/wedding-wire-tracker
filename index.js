// read env vars from .env file
require('dotenv').config()

const axios = require('axios');
const Promise = require('bluebird');
const WEDDING_WIRE_USER = process.env.WEDDING_WIRE_USER;
const WEDDING_WIRE_PASS = process.env.WEDDING_WIRE_PASS; 

const formUrlEncoded = x =>
   Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

axios.defaults.withCredentials = true;
axios.post('https://www.weddingwire.com/com-Login.php', formUrlEncoded({
  Mail: WEDDING_WIRE_USER,
  Password: WEDDING_WIRE_PASS 
}), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  maxRedirects: 0,
  validateStatus: function (status) {
    return status >= 200 && status < 300 || status == 302; // default
  }
})
  .then(function (response) {
    const cookie = response.headers['set-cookie'];
    console.log("LOGIN!!!");
    console.log(response);
    //ask to download checklist
    return axios.get('https://www.weddingwire.com/tools/ChecklistCSV', {
      headers: {
        Cookie: cookie
      }
    });
  })
  .then(function (response) {
    
    console.log("CHECKLIST!!!");
    console.log(response);
  })
  .catch(function(error) {
    console.error('ERROR!');
    console.error(error);
  })