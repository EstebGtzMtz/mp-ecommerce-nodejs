const express = require('express');
const exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/detail', function(req, res) {
    const { img, title, price, unit } = req.query;
    mercadopago.configure({
        access_token: 'TEST-7100690938035652-031121-b8e4798a48c92d97de8ca9ca63f96f39-303796120'
    });

    let preference = {
        items: [{
            'title': title,
            'unit_price': Number(price),
            'quantity': Number(unit),
            'picture_url': img
        }]
    }

    mercadopago.preferences.create(preference)
        .then((response) => {
            global.init_point = response.body.init_point;
            res.render('detail', { img, price, unit, title, id_preference: response.body.id });
        })
        .catch((error) => {
            console.log(error);
        })
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(3000);