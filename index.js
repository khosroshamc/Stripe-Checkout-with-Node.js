require('dotenv').config()

const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res)=> {
    res.render('index.ejs')
})

app.post('/checkout', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items:[

            {
                price_data:{
                    currency: 'usd',
                    product_data: {
                        name: 'Node.js and Express'
                    },
                    unit_amount: 50 * 100,
                },
                quantity: 1
            },
            {
                price_data:{
                    currency: 'usd',
                    product_data: {
                        name: 'Javascript T-shirt'
                    },
                    unit_amount: 30 * 100,
                },
                quantity: 2
            }
        ],
        mode: 'payment',
        shipping_address_collection : {
           allowed_countries: ['US', 'BR']},
        success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`
    })
    console.log(session)
    res.redirect(session.url)
})
app.get('/complete', async (req, res) => {
    const result = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method']}),
        stripe.checkout.sessions.listLineItems(req.query.session_id )
    ])
    console.log(JSON.stringify(await result))
    res.send('Your Purches was succesful')
})
app.get('/cancel', (req, res) => {
    res.redirect(('/123'))
})
app.listen(3000, () => console.log('server started on port 3000'))