# waypost

Full-stack application for feature flag management

# Database setup

NOTE: This is for early development. Delete from readme later.

1. Go to the root folder of waypost
2. Run `$ createdb waypost`
3. Run "$ psql waypost < ./server/db/waypost_data_dump.sql"
4. Open postgres and connect to waypost database to ensure all data made it in correctly
`$ psql -d waypost` then run `SELECT * FROM flags;`
5. Add .env to the /server folder. It should look like:
   DB="waypost"
   DB_USER=<your username>
   DB_PASSWORD=<Your password>
Note, if you don't remember your username/pw, follow this tutorial: https://stackoverflow.com/questions/10845998/i-forgot-the-password-i-entered-during-postgres-installation
- Hint: if you're already connected as the postgres user, which is the default, you can just skip to step 6 of tutorial

