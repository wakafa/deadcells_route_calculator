const express = require('express')
const { spawn } = require('child_process');
const app = express()
const port = 3000
const path = require('path')

let biomesList;
const python = spawn('python', [path.join('data_gathering', 'main.py')]);

python.stdout.on('data', data => {
    console.log('Pipe data from python script ...');
    biomesList = data.toString();
    console.log("Biomes list updated")
});
python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
});

app.get('/', (req, res) => {
    res.send("Welcome to Dead Cells Route Calculator!")

})


app.get('/biomes_list', (req, res) => {
    console.log("Hello")
    res.send(biomesList)
})


app.listen(port, () => console.log(`Example app listening on port 
${port}!`))