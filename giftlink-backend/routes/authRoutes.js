const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Importar o logger Pino

//Tarefa 1: Use o `body`, `validationResult` do `express-validator` para validação de entrada
const { body, validationResult } = require('express-validator');


const logger = pino();  // Criar uma instância do logger Pino

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
      //Conectar ao `giftsdb` no MongoDB através de `connectToDatabase` em `db.js`.
	  const db = await connectToDatabase();
      const collection = db.collection("users");
      const existingEmail = await collection.findOne({ email: req.body.email });

        if (existingEmail) {
            logger.error('O ID de email já existe');
            return res.status(400).json({ error: 'O ID de email já existe' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email=req.body.email;
        console.log('o email é',email);
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('Usuário registrado com sucesso');
        res.json({ authtoken,email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Erro interno do servidor');
    }
});

router.post('/login', async (req, res) => {
    console.log("\n\n Dentro do login")

    try {
        // const collection = await connectToDatabase();
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password)
            if(!result) {
                logger.error('As senhas não coincidem');
                return res.status(404).json({ error: 'Senha incorreta' });
            }
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const userName = theUser.firstName;
            const userEmail = theUser.email;

            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('Usuário logado com sucesso');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('Usuário não encontrado');
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Erro interno do servidor', details: e.message });
      }
});

// API de atualização
router.put('/update', async (req, res) => {
	// Tarefa 2: Valide a entrada usando `validationResult` e retorne uma mensagem apropriada se houver um erro.

    const errors = validationResult(req);

	// Tarefa 3: Verifique se o `email` está presente no cabeçalho e lance uma mensagem de erro apropriada se não estiver presente.
	if (!errors.isEmpty()) {
        logger.error('Erros de validação na solicitação de atualização', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.headers.email;

        if (!email) {
            logger.error('Email não encontrado nos cabeçalhos da solicitação');
            return res.status(400).json({ error: "Email não encontrado nos cabeçalhos da solicitação" });
		}

		//Tarefa 4: Conectar ao MongoDB
		const db = await connectToDatabase();
        const collection = db.collection("users");

		//Tarefa 5: Encontrar credenciais do usuário
        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            logger.error('Usuário não encontrado');
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();

		//Tarefa 6: Atualizar credenciais do usuário no BD
        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

		//Tarefa 7: Criar autenticação JWT com user._id como payload usando a chave secreta do arquivo .env
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('Usuário atualizado com sucesso');

        res.json({ authtoken });
    } catch (error) {
        logger.error(error);
        return res.status(500).send("Erro interno do servidor");
    }
});
module.exports = router;  