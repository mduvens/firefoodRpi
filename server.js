const express = require('express')
const mysql = require('mysql')
let app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
let stringify = require('json-stringify-safe')
let urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

let connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'b$bmR8aw',
    database: 'firefood'
})

connection.connect(function(error){
    if (!!error) console.log('Error with DB')
    else console.log('Connected to DB')
})

let PORT = process.env.PORT || 3002

let total = 0
let produtos = {}
let pedido = {}
let precos = {
    "CheeseBurguer":2,
    "ChickenBacon": 1.5
}

app.get('/', function(req,res){   
    res.sendFile(__dirname + '/index.html')
})
app.get('/yo', function(req,res){
    yo = "yoo"
    console.log(yo)
    res.send("yo")
})

app.get('/burguer', function(req,res){
    res.sendFile(__dirname + '/burguer.html')
})
app.get('/pedido', function(req,res){
    res.sendFile(__dirname + '/pedido.html')
})

app.get('/precos', function(req,res){
    res.send(precos)
})

app.post('/addProdutos',urlencodedParser,function(req,res){  
    Object.keys(req.body).forEach(i => {
        if (i in Object.keys(produtos))
            produtos[i] += req.body[i]
        else
            produtos[i] = req.body[i]
    })
    //console.log(produtos)
})

app.get('/getProdutos', function(req,res){
    res.send(produtos)
})

app.post('/guardaPedido',urlencodedParser,function(req,res){
        saveDB(pedido)
        pedido = {}
        produtos = {}
        // res.redirect('/')
})

saveDB = function(pedido){
    Object.keys(pedido).forEach(i => {
        console.log("yoooooo3")
        total = pedido[i]['quantidade'] * pedido[i]['preco']
        let sql = "INSERT INTO `pedidos` (`quantidade`, `produto`, `preco`, `total`) VALUES (?);"
        connection.query(sql,[[pedido[i]['quantidade'],i,pedido[i]['preco'],total]], function(error,rows,fields){
            if (error) {
                console.log('Error in the query')
            } else {
                console.log('Inserido na BD')
            }
            })
    })

}
app.get('/getPedido', function(req,res){         
    constroiPedido()
    res.send(pedido)
})

app.listen(PORT)

constroiPedido = function(){
    Object.keys(produtos).forEach(i =>{
        pedido[i] = {"preco":precos[i],"quantidade":produtos[i]}
    })
    return pedido
}
