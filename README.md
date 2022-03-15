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
## Endpoint: api/flags/:id/experiments
No request body needed.
Returns an array of all the experiments for the given flag.

Response example:
```
[
    {
        "id": 1,
        "flag_id": 1,
        "date_started": "2022-03-14T07:00:00.000Z",
        "date_ended": null,
        "duration": 30,
        "hash_offset": 83,
        "name": "Experiment 1",
        "description": "Description for expt 1",
        "metric_ids": [1,2],
        "mean_test": null,
        "mean_control": null,
        "standard_dev_test": null,
        "standard_dev_control": null,
        "p_value": null
    }
]
```

## Endpoint: GET api/experiments/:id

No request body needed.
Returns the experiment with the given id.

Response example:

```
{
    "id": 2,
    "flag_id": 2,
    "date_started": "2022-03-14T07:00:00.000Z",
    "date_ended": null,
    "duration": 30,
    "hash_offset": 41,
    "name": "Experiment 2",
    "description": "Description for expt 2",
    "metric_ids": [1,2],
    "mean_test": null,
    "mean_control": null,
    "standard_dev_test": null,
    "standard_dev_control": null,
    "p_value": null
}
```
## Endpoint: POST api/experiments
For creating a new experiment.  Request body should have the following fields in the example unless marked optional.
Example:
```
{
  "flag_id": 1,
  "duration": 30,
  "metric_ids": [101, 102, 103],
  "name": "First experiment", (OPTIONAL)
  "description": "Very important test" (OPTIONAL)
}
```
The API will return the newly created experiment object.
Example response:
```
{
    "id": 4,
    "flag_id": 1,
    "date_started": "2022-03-14T07:00:00.000Z",
    "date_ended": null,
    "duration": 30,
    "hash_offset": 2,
    "name": "First experiment",
    "description": "Very important test",
    "metric_ids": [101,102, 103],
    "mean_test": null,
    "mean_control": null,
    "standard_dev_test": null,
    "standard_dev_control": null,
    "p_value": null
}
```

## Endpoint: PUT api/experiments/:id
Request body should contain all updated fields and their new values. Can use this to end the experiment (set the date_ended), or to update other fields like duration, name, etc. Example:
```
{
  "duration": 30,
  "name": "My cool experiment",
  "description": "A cool description"
}
```
Returns the newly updated experiment.
Response example:
```
{
    "id": 1,
    "flag_id": 1,
    "date_started": "2022-03-14T07:00:00.000Z",
    "date_ended": null,
    "duration": 31,
    "hash_offset": 83,
    "name": "Experiment 1",
    "description": "Description for expt 1",
    "metric_ids": [1, 2],
    "mean_test": null,
    "mean_control": null,
    "standard_dev_test": null,
    "standard_dev_control": null,
    "p_value": null
}
```
## Endpoint: GET api/metrics
Returns an array of all metrics for the account.
Example response:
```
[
    {
        "id": 1,
        "name": "Created Account",
        "query_string": "SELECT * FROM accounts;",
        "type": "binomial"
    },
    {
        "id": 2,
        "name": "Pages per visit",
        "query_string": "SELECT * FROM pages_per_visit;",
        "type": "count"
    },
    {
        "id": 3,
        "name": "Time on site",
        "query_string": "SELECT * FROM time_on_site;",
        "type": "duration"
    }
]
```
## Endpoint: GET api/metrics/:id
Returns the metric with the given id.
Example response:
```
{
    "id": 1,
    "name": "Created Account",
    "query_string": "SELECT * FROM accounts;",
    "type": "binomial"
}
```
## Endpoint: POST api/metrics
For creating a new metric. Required fields are:
- name (string up to 50 chars, must be unique)
- query_string (string representing the query to get this data from your database)
- type (one of: 'binomial', 'count', 'duration', 'revenue')
Example request body:
```
{
  "name": "Pageviews",
  "query_string": "SELECT * FROM pageviews;",
  "type": "count"
}
```
Returns the newly created metric.
Example response body:
```
{
    "id": 10,
    "name": "Pageviews",
    "query_string": "SELECT * FROM pageviews;",
    "type": "count"
}
```
## Endpoint: PUT api/metrics/:id
For editing a specific metric. Fields can include name, query_string, or type.
Example response body:
```
{
  "name": "Pageviews per user"
}
```
Returns the newly updated object.
Example response body:
```
{
    "id": 10,
    "name": "Pageviews per user",
    "query_string": "SELECT * FROM pageviews;",
    "type": "count"
}
```
## Endpoint: DELETE api/metrics/:id
For deleting a specific metric. No request body needed.
Example response body for `DELETE api/metrics/10`:
`"Metric 'Pageviews per user' with id 10 successfully deleted"`

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
status 200
{
    "connected": false
}
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
