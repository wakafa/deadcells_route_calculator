//// Import the functions you need from the SDKs you need
//const { initializeApp } = require("firebase/app");
//const { getAnalytics } = require("firebase/analytics");
//// TODO: Add SDKs for Firebase products that you want to use
//// https://firebase.google.com/docs/web/setup#available-libraries
//
//// Your web app's Firebase configuration
//// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//const firebaseConfig = {
//  apiKey: "AIzaSyCMrS0aaW3ePbSjXNjL7YKzg-KYarf2sQM",
//  authDomain: "dead-cells-route-calculator.firebaseapp.com",
//  projectId: "dead-cells-route-calculator",
//  storageBucket: "dead-cells-route-calculator.appspot.com",
//  messagingSenderId: "308628283647",
//  appId: "1:308628283647:web:162a765df0dd0b3fe46cca",
//  measurementId: "G-85TD9E0RF3"
//};
//
//// Initialize Firebase
//const firebaseapp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseapp);

const express = require('express')
const { spawn } = require('child_process');
const path = require('path')
const fs = require('fs');
const app = express()
const port = 3000


const BIOMES_DIR = "Biomes"
const python = spawn('python', [path.join('data_gathering', 'main.py')]);

this.biomesList = {
    biomes: []
}

let get_biome_list = () => {
    fs.readdir(BIOMES_DIR, (err, files) => {
        files.forEach(file => {
            let data = fs.readFileSync(path.join(BIOMES_DIR, file))
            biomeData = JSON.parse(data)
            if (biomeData.unused) {
                console.log(`Skipping unused map : ${biomeData.name}`)
            } else {
                this.biomesList.biomes.push(biomeData)
            }
        })
    })
}

python.on('close', (code) => {
    console.log(`Done collecting data, code :  ${code}`);
    biomesList = get_biome_list()
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/biomes_list', (req, res) => {
    res.send(this.biomesList)
})

app.use(express.static(path.join(__dirname)))
app.listen(port, () => console.log(`Example app listening on port
${port}!`))