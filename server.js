const express = require('express');
const winston = require('winston');

const app = express();
const port = 3000;

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Middleware to parse JSON requests
app.use(express.json());

// Function to validate numbers
const validateNumbers = (num1, num2) => {
    if (isNaN(num1) || isNaN(num2)) {
        return 'Invalid input: Both num1 and num2 must be numbers';
    }
    return null;
};

// Arithmetic operations endpoints
app.get('/:operation', (req, res) => {
    const { operation } = req.params;
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    // Validate input
    const error = validateNumbers(num1, num2);
    if (error) {
        logger.error(`Error: ${error}`);
        return res.status(400).json({ error });
    }

    let result;
    switch (operation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            if (num2 === 0) {
                logger.error('Error: Division by zero is not allowed');
                return res.status(400).json({ error: 'Division by zero is not allowed' });
            }
            result = num1 / num2;
            break;
        default:
            logger.error('Error: Invalid operation');
            return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide' });
    }

    logger.info(`New ${operation} operation requested: ${num1} ${operation} ${num2}`);
    res.json({ result });
});

// Start the server
app.listen(port, () => {
    logger.info(`Calculator microservice running on port ${port}`);
});