# Database Synchronization Script

This document describes the `dbSync` script, which is used to synchronize the database schema with the Sequelize models defined in the application.

## Overview

The `dbSync` script uses Sequelize's `sync` method with the `{ alter: true }` option. This ensures that the database schema matches the models without dropping tables, making it safe for local development when adding or modifying fields.

- **Location**: `api/bin/dbSync.js`
- **Sequelize Command**: `sequelize.sync({ alter: true })`

## How to Run

You can execute this script using `npm` from the `api` directory:

```bash
npm run dbSync
```

Alternatively, you can run it directly with Node.js:

```bash
node ./bin/dbSync.js
```

## Expected Output

Upon successful synchronization, you will see the following message in the terminal:

```text
Database has been migrated successfully, you can now start the server.
```

## Important Notes

> [!IMPORTANT]
> While `alter: true` attempts to modify tables without data loss, it is always recommended to back up your database before running synchronization scripts in an environment where data is critical.
