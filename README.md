# kashier
steps to run the app:
- git clone repo.
- copy attached .env to the project root folder.
- the NODE_ENV = development by default
- change src/config/sequelize-config.json with your DB name, DB user, DB password.
- npm run migrate:dev
- npm run seed:dev
- npm run dev
- the root user will be seeded into database with id="e2d992d5-a2e8-4eb6-aa87-8604eb0b608d".
- you need to send your first request to create a user with "globalManager" role and insert userId="e2d992d5-a2e8-4eb6-aa87-8604eb0b608d" in headers.
- use accessToken returned with the created "globalManager" user from previous step in subsequent requests in headers as in the attached API collection.
# mongoose
