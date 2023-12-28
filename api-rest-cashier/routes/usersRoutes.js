const router = require('express').Router();
var mongoose = require('mongodb')
const User = require('../models/User');

router.get('/:login/:senha', async (req, res) => {
    try {
        const {login, senha} = req.params;
        console.log(login);
        User.findOne({ login: login }).exec(function(error, user) {
            if (error) 
                res.status(203).json({message: 'Login incorreto.'})
             console.log(user)
            // test a matching password
            user.comparePassword(senha, function(matchError, isMatch) {
                if (matchError) {
                    res.status(203).json({message: 'Algo deu errado.'})
                } else if (!isMatch) {
                    res.status(203).json({message: 'Senha incorreta.'})
                } else {
                    res.status(200).json(user);
                } 
            });
        });
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/:user', async (req, res) => {
    try {
        const {user} = req.params;
        var otherUser = await User.findOne({_id: mongoose.ObjectId(user)});

        if (otherUser)
            res.status(200).json(otherUser);
        else
            res.status(203).json({message: 'Usuário não encontrado.'})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router