const routes = require('express').Router();

let list = [{ id: 1, email: 'a@a.com', pass: '123456', name: 'Aman' }, { id: 2, email: 'b@b.com', pass: '123456', name: 'HP' }]

routes.post('/login', (req, res) => {
    try {
        let body = req.body;
        let match = list.find(u => u.email === body.email && u.pass === body.password)
        if (match) res.json({ status: 200, message: 'login successfull', data: { name: match.name, id: match.id } });
        else res.json({ status: 403, message: 'wrong credentials' });
    } catch (error) {
        console.log(error);
    }
})


routes.post('/getContacts', (req, res) => {
    try {
        let body = req.body;
        res.json({ lists: [{ id: 3, name: 'Acer' }] })
    } catch (error) {
        console.log(error);
    }
})














module.exports = routes;
