const express = require('express')
const { spawn } = require('child_process');
const path = require('path')
const fs = require('fs')
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
    res.sendFile(path.join(__dirname, 'pages', 'welcome.html'))
})

app.get('/biomes_list', (req, res) => {
    res.send(this.biomesList)
})

app.use(express.static(path.join(__dirname, 'scripts')))
    // app.use(express.static(path.join(__dirname)))
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))