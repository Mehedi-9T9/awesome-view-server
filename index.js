const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// midleware
app.use(cors)
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Awesome view server is running')
})

app.listen(port, () => {
    console.log(`the server running port: ${port}`);
})