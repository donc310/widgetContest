const express = require('express')
const app = express()
const path = require('path')
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/dist'));
app.get('/', (req, res) => res.send('<a href="/index.html">Wiget Dev</a>'))
app.get('/index.html', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './')
    })
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
    });