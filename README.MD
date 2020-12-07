**EXPRESS BOILER PLATE**

Express app boiler-plate with JWT authentification (cookie based - httpOnly)

It includes

- JWT Authentification
- MongoDB Config
- REST API (POST, PUT, DELETE)
- Graphql
- User Model with EndPoints
- User Roles (is_user, is_staff, is_admin)
- Paystack Setup
- SendGrid Setup
- ESLINT config
- Prettier config

**SETUP**

1.  `yarn` or `npm install`
2.  Replace all occurance of 'your-app' to your app's name
3.  Adjust _JWT_SECRET_ in `.env` file
4.  Add your _SENDGRID_KEY_ and *PAYSTACK_KEY*s in `.env` file
5.  Adjust mail _from_ in `config/index.js`
6.  Other configurations are in `config/index.js` file
7.  Add folder called _ssl_ where you will place your `server.cert` and `server.key`
