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

# API Docs

## Endpoint: GET api/flags

Returns all feature flags stored in the Waypost postgres db:

```
[
   {
        "id": 1,
        "app_id": null,
        "name": "Test Flag 1",
        "description": "This is a test description",
        "status": true,
        "date_created": "2021-03-02T07:00:00.000Z",
        "date_edited": "2021-03-02T07:00:00.000Z",
        "last_toggle": "2021-03-02T07:00:00.000Z"
    },
    ...
]
```

## Endpoint: GET api/flags/:id

Returns a feature flag stored in the Waypost db:

```
{
  id: 1,
  app_id: null,
  name: 'Test flag 1',
  description: 'This is a test description',
  status: false,
  percentage_split: 0,
  is_experiment: false,
  is_deleted: false,
  date_created: 2021-03-02T08:00:00.000Z
}
```

## Endpoint: POST api/flags

NOTE: This doc was last Updated 2022/03/04. This route will change in the future

Creates a new feature flag and adds it to the Waypost database.

Body of the request:

```
{
   name: "flag name",
   description?: "desritpion of flag"
   status?: boolean
}
```

response example:

```
{
   "id":6,
   "app_id":null,
   "name":"caleb_test_flag",
   "description":null,
   "status":true,
   "date_created":"2022-03-05T07:00:00.000Z",
   "date_edited":"2022-03-05T07:00:00.000Z",
   "last_toggle":"2022-03-05T07:00:00.000Z"
}
```

## Endpoint: PUT api/flags/:id

body of the request:

```
{
   "attribute_to_edit": new_value
}
```

response example:

```
{
   "id":6,
   "app_id":null,
   "name":"caleb_test_flag",
   "description":null,
   "status":true,
   "date_created":"2022-03-05T07:00:00.000Z",
   "date_edited":"2022-03-05T07:00:00.000Z",
   "last_toggle":"2022-03-05T07:00:00.000Z"
}
```

## Endpoint: DELETE api/flags/:id

No request body needed

Response example:

```
`Flag '${deletedFlagName}' with id = ${id} successfully deleted`
```

## Endpoint: POST api/connection

Request body:

```
{
    "user": "user",
    "host": "localhost",
    "password": "password",
    "database": "database name",
    "port": 5432
}
```

Possible responses:

Success:

```
`Connection added`
```

Fail to authenticate:

```
`Authentication failed`
```

Fail to insert into db:

```
`Insert to database failed`
```

## Endpoint: DELETE api/connection

No request body needed

response:

```
`Connection removed`
```

## Endpoint: GET api/connection

No request body needed

Successful response:

```
{
    "connected": true,
    "database": "user_event_data"
}
```

Unsuccessful response:

```
{
   "connected": false
}
```
