config > config.env

```
NODE_ENV=development
PORT=5000

# connection string from mongodb to connect to your application.
# DB_NAME set to be devcamper
MONGO_URI=MONGO_URI=mongodb+srv://<USER_NAME>:<PASSWORD>@kavoos.rir60.mongodb.net/<DB_NAME>?retryWrites=true&w=majority

GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=[MAPQUEST_CONSUMER_KEY]

FILE_UPLOAD_PATH=./public/uploads
MAX_FILE_UPLOAD=1000000

JWT_SECRET=[SOME RANDOM STRING]
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# different services can be used to send the email.
# Mailtrap is used right now, but in production you
# can use services like Send Grid or Gmail
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=[EMAIL]
SMTP_PASSWORD=[PASSWORD]
FROM_EMAIL=noreply@devcamper.io
FROM_NAME=DevCamper
```

```
npm install express dotenv
npm install -D nodemon
```

```
npx eslint --init
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

```
npm install mongoose
```

```
npm install colors
```

```
npm install slugify
```

```
npm install node-geocoder
```

```
npm install express-fileupload
```

```
npm install jsonwebtoken bcryptjs
```

```
npm install cookie-parser
```

```
npm install nodemailer
```

```
npm install express-mongo-sanitize
```

```
npm install helmet
npm install xss-clean
```

```
npm install express-rate-limit
npm install hpp
npm install cors
```
