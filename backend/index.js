const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 9001;

app.use(cors());
app.use(express.json());

const onConnect = mysql.createConnection({
    host: 'mysql://mysql:6rXz3YZRmtOBKaHjoUEWKwXGscfwuVbAO43Pfkqo3RuuXbjk788zsa3gQwU94VV9@o4gs7sitvjxw9o3dzicnvol2:3306/default',
    user: 'mysql',
    password: '6rXz3YZRmtOBKaHjoUEWKwXGscfwuVbAO43Pfkqo3RuuXbjk788zsa3gQwU94VV9',
    database: 'default',
	ssl: { rejectUnauthorized: true }  
});

onConnect.connect((error) => {
    if(error) throw error;
    console.log(`Database Connect Sucessfully`);
});

app.get('/', (req, res) => {
    let sql = `SELECT * FROM users`;
     onConnect.query(sql, (error, result) => {
        if(error) throw error;   
        res.status(200).send(result);
     })
});

app.post('/api/create', (req, res) => {
    try {
        let { name, email, work } = req.body;
        let sql = "INSERT INTO users SET ?";

        onConnect.query(sql, { name, email, work }, (error, result)=> {
            if(error) throw error;   
            res.status(200).send(result);
        });
    } catch (error) {
      res.status(400).send(error.message);  
      console.log(error.message);
    }
});


app.get("/api/:id", (req, res) => {
    let sql = `SELECT * FROM users WHERE ${req.params.id}`
    console.log(sql)
	onConnect.query(sql, (err, result) => {
		if (err) throw err;
        res.status(200).send(result);
	});
});

app.put('/api/update/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, work } = req.body;
        let sql = `UPDATE users SET name='${name}', email='${email}', work='${work}' WHERE id=${id}`;

        onConnect.query(sql, (error, result) => {
            if(error) throw error;
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE id=${id}`;
    onConnect.query(sql, (error, result) => {
        if(error) throw error;   
        res.status(200).send(result);
    });
})

app.listen(PORT, ()=> console.log(`Server is listening at: http://localhost:${PORT}`));
