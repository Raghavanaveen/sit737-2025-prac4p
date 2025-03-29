Calculator Microservice
 * 
 * This microservice provides basic arithmetic operations via REST API.
 * It supports addition, subtraction, multiplication, and division.
 * Winston logging is integrated for monitoring and debugging.
 * 
 * Setup Instructions:
 * 1. Install Node.js (https://nodejs.org/)
 * 2. Initialize the project:
 *    mkdir sit737-2025-prac4p && cd sit737-2025-prac4p
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
 * 6. Check logs:
 *    tail -f logs/combined.log
 */
