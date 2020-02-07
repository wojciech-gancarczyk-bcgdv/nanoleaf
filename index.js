import express from "express";
import fs from "fs";
import request from "superagent";

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  
});

// Check if devices have been paired, and if not pair them.
const pairDevices = (start) => {
  return request.post('http://192.168.2.1:16021/api/v1/new')
    .timeout({
      response: 5000,
      deadline: 5000,
    })
    .then((res) => {
      console.log('Paired');
      console.log(res.auth_token);
      fs.writeFileSync('/var/run/nano.auth', res.auth_token);
      start();
    })
    .catch((err) => {
      console.error('Cannot pair the devices');
      console.log(err);
    });
};

const start = () => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

try {
  fs.readFileSync('/var/run/nano.auth', 'r');
  start();
} catch {
  console.info('Devices have not been paired, pairing ...');
  pairDevices(start);
}
