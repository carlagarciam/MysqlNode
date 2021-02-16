const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 5000;

// para parsear el json que mandamos por postman
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Conexión a mysql
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'adat_vuelos'
})

// MOSTRAR TODOS LOS VUELOS
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('Conectado como ' + connection.threadId)
        connection.query('SELECT * from vuelos', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            console.log('Los datos de la tabla vuelos son: \n', rows)
        })
    })
})
// BUSCAR UN VUELO POR CODIGO VUELO
app.get('/:CodigoVuelo', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM vuelos WHERE CodigoVuelo = ?', [req.params.CodigoVuelo], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('Los datos de la tabla vuelos son: \n', rows)
        })
    })
});
// BORRAR UN VUELO
app.delete('/:CodigoVuelo', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM vuelos WHERE CodigoVuelo = ?', [req.params.CodigoVuelo], (err, rows) => {
            connection.release() // devuelve la conexion
            if (!err) {
                res.send(`El vuelo con el Codigo Vuelo ${[req.params.CodigoVuelo]} ha sido eliminado`)
            } else {
                console.log(err)
            }

            console.log('Los datos de la tabla vuelos son: \n', rows)
        })
    })
});
// añadir un vuelo
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        const params = req.body
        connection.query('INSERT INTO vuelos SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Se ha añadido el codigo vuelo correctamente.`)
            } else {
                console.log(err)
            }

            console.log('Los datos de la tabla vuelos son: \n', rows)

        })
    })
});

app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Conectado con ID ${connection.threadId}`)

        const { CodigoVuelo, Origen, Destino, Fecha, Hora ,PlazasTotales,PlazasDisponibles} = req.body

        connection.query('UPDATE vuelos SET Origen = ?, Destino = ?, Fecha = ?, Hora = ?,PlazasTotales = ?,PlazasDisponibles = ? WHERE CodigoVuelo = ?', [Origen, Destino, Fecha, Hora,PlazasTotales,PlazasDisponibles, CodigoVuelo] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`El vuelo ha sido actualizado correctamente`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
});


// NECESARIO PARA ESCUCHAR POR EL PUERTO 5000
app.listen(port, () => console.log(`Listening on port ${port}`))

