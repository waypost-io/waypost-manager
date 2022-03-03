# waypost

Full-stack application for feature flag management

# Database setup

NOTE: This is for early development. Delete from readme later.

1. Open postgres in your console
2. run "psql postgres < /waypost/server/db/waypost_data_dump.sql" in the terminal
3. Open postgres, connect to the waypost database and select all features to ensure that the data made it in correctly.
4. Add .env to the /server folder. It should look like:
   DB="waypost"
   DB_USER=<your username>
   DB_PASSWORD=<Your password>
