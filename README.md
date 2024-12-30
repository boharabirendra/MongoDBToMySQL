# MongoDBToMySQL

Data migration from MongoDB to MySQL

# Prerequisite

System should have installed following

- Node.js
- MongoDB Command Line Database Tools

# Steps to run script

- Clone the git repository using below command

```sh
   git clone git@github.com:boharabirendra/MongoDBToMySQL.git
```

- Navigate to repository and install the dependency using below command

```sh
   npm install
```

- Create .env file same as .env.example
- Add MySQL & MongoDB credentials to .env file
- Run the script using below command

```sh
   node scripts/index.js (if you are in MongoDBToMySQL folder)

   or

   node index.js (if you are inside of scripts folder)
```
