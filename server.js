const express = require('express')
const app = express()
const path = require('path')
const port = 3000
app.get('/', (req, res) => res.send('Welcome to  widget dev'))
app.use(express.static(__dirname + '/dist'));
app.get('/index.html', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './')
    })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))