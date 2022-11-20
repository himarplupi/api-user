# api-user

API User/Service User himarpl.com

## Install Projek

### Clone Projek

```
git clone https://github.com/himarplupi/api-user.git
```

### Install

Buka projek yang sudah diclone pada terminal, lalu ketikkan

```javascript
npm install
```

### Running Projek

```javascript
npm run start
// equal
node ./bin/www
```

atau menggunakan nodemon

```javascript
npm run dev
// equak
nodemon ./bin/www
```

## Konfigurasi Environment

Step:

1. Duplikat file .env.example
2. Rename duplikasi file menjadi .env
3. Isi variabel .env sesuai dengan kredensial yang diperlukan

## Database

Pengelola database menggunakan ORM [sequelize](https://sequelize.org)

### Membuat file konfigurasi

Buat file dengan nama `.sequelizerc` dan direktori dengan nama `database` pada root direktori:

```javascript
// .sequlizerc

const path = require('path')

module.exports = {
  'config': path.resolve('./database/config', 'config.js'),
  'models-path': path.resolve('./database/models'),
  'seeders-path': path.resolve('./database/seeders'),
  'migrations-path': path.resolve('./database/migrations'),
}
```

### Initial sequelize

```javascript
npx sequelize-cli init
```

*note: Pastikan sudah terinstall `sequelize`, `sequelize-cli`, `pg`, `pg-hstore`

Edit file `database/config/config.js` menjadi:

```javascript
// database/config/config.js

require('dotenv').config()

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_DIALECT
} = process.env

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT
  }
}
```

### Membuat Model dan Migration

```javascript
npx sequelize model:generate --name NamaModel --attributes field:tipe-data, ...
```

Setelah itu akan muncul file model pada direktori `database/models/` dan `database/migrations`

Dokumentasi selengkapnya:

🔗 [https://sequelize.org/docs/v6/other-topics/migrations/](https://https://sequelize.org/docs/v6/other-topics/migrations/)
