/**
 * Calculator Microservice
 * 
 * This microservice provides basic arithmetic operations via REST API.
 * It supports addition, subtraction, multiplication, division, exponentiation, square root, and modulo.
 * Winston logging is integrated for monitoring and debugging.
 * 
 * Setup Instructions:
 * 1. Install Node.js (https://nodejs.org/)
 * 2. Initialize the project:
 *    mkdir sit737-2025-prac4c && cd sit737-2025-prac4c
 *    npm init -y
 * 3. Install dependencies:
 *    npm install express winston
 * 4. Run the microservice:
 *    node index.js
 * 5. Test API endpoints using a browser, Postman, or curl:
 *    http://localhost:3000/add?num1=10&num2=5
 *    http://localhost:3000/subtract?num1=10&num2=5
 *    http://localhost:3000/multiply?num1=10&num2=5
 *    http://localhost:3000/divide?num1=10&num2=5
 *    http://localhost:3000/exponentiate?num1=2&num2=3
 *    http://localhost:3000/squareRoot?num1=16
 *    http://localhost:3000/modulo?num1=10&num2=3
 * 6. Check logs:
 *    tail -f logs/combined.log
 */

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
const validateNumbers = (num1, num2 = null) => {
    if (isNaN(num1) || (num2 !== null && isNaN(num2))) {
        return 'Invalid input: Both num1 and num2 must be numbers';
    }
    return null;
};

// Arithmetic operations endpoints
app.get('/:operation', (req, res) => {
    const { operation } = req.params;
    const num1 = parseFloat(req.query.num1);
    const num2 = req.query.num2 !== undefined ? parseFloat(req.query.num2) : null;

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
        case 'exponentiate':
            result = Math.pow(num1, num2);
            break;
        case 'squareRoot':
            if (num1 < 0) {
                logger.error('Error: Cannot calculate the square root of a negative number');
                return res.status(400).json({ error: 'Cannot calculate the square root of a negative number' });
            }
            result = Math.sqrt(num1);
            break;
        case 'modulo':
            result = num1 % num2;
            break;
        default:
            logger.error('Error: Invalid operation');
            return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, divide, exponentiate, squareRoot, or modulo' });
    }

    logger.info(`New ${operation} operation requested: ${num1} ${operation} ${num2}`);
    res.json({ result });
});

// Start the server
app.listen(port, () => {
    logger.info(`Calculator microservice running on port ${port}`);
});
