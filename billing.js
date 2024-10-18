// Install twilio: npm install twilio express body-parser
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors'); // Import CORS

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const accountSid = 'AC336c80575313977325f45338d157b04f';
const authToken = '48a19babff1a1940111e0d470234e9d0';
const client = new twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
    const { number, cart, total } = req.body;

    let messageBody = 'Your order:\n';
    cart.forEach(item => {
        messageBody += `${item.item} - RS. ${item.price}\n`;
    });
    messageBody += `Total: Rs. ${total}`;

    client.messages.create({
        body: messageBody,
        to: number,
        from: '+18646572961'
    })
    .then(message => res.json({ success: true, messageSid: message.sid }))
    .catch(err => res.json({ success: false, error: err.message }));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
