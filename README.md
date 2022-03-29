<p align="center">
    <img src="./client/public/assets/PNGs/Waypost_graphic_color.png" alt="Waypost logo" width="200" height="200">
</p>

Waypost is an open-source, lightweight, self-hosted feature flag management system that specializes in A/B Testing, providing analytical insights for your experiments on both the front-end and back-end.

## Usage

This repository contains the files to run the Waypost feature flag managment application. This application allows you to create, update, and delete feature flags, connect to an outside database to analyze user event data, and communicate with a Waypost flag provider service so that flags are available to clients. Note that this appication is intended to be used with both the [Waypost flag provider](https://github.com/waypost-io/waypost-flag-provider) and [Waypost SDKs](https://github.com/waypost-io/waypost-react-sdk).

To learn more about Waypost, visit our [case study page]().

For more detailed information on how to use Waypost, visit our [documentation page]().

## Database setup

1. With postgres installed, log in to the postgres console and create a new database called "waypost"

```
CREATE DATABASE waypost;
/c waypost
```

2. Run all of the queries in the /server/waypost_db_setup.sql file to create the waypost schema locally.
3. Make sure that the credientials in the .env file match your postgres login credientials (see "local setup").

## Local setup

1. Clone the Waypost repository.

```
git clone https://github.com/waypost-io/waypost.git
cd waypost
```

2. Install dependancies

```
cd waypost/server
npm install
cd ../client
npm install
```

3. Add .env file in the server directory with the following environment variables. Make sure the URL’s and WEBHOOK_VALIDATOR are correct.

```
POSTGRES_DB="waypost"
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_HOST="localhost"
POSTGRES_PORT= 5432
WEBHOOK_VALIDATOR="secret"
FLAG_PROVIDER_URL="http://localhost:5050"
```

and in the client directory: (optional if you want to run tests)

```
NODE_ENV="development"
```

4. Start the back-end from the server directory.

```
npm start
```
5. Open a new terminal and start the front-end from the client directory.
```
cd ../client
npm start
```
The client will run on port :3000 and the server will run on port :5000.

# API Docs

## Endpoint: GET api/flags

Returns all feature flags stored in the Waypost postgres db:

```
[
   {
        "id": 1,
        "name": "Feature Flag 1",
        "description": "A detailed description",
        "status": true,
        "percentage_split": 50,
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
  name: 'Feature Flag 1',
  description: 'A detailed description',
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
   name: "More ads",
   description: "This feature adds more ads"
   status: boolean
}
```

response example:

```
{
   "id": 6,
   "app_id": null,
   "name": "caleb_test_flag",
   "description": null,
   "status": true,
   "date_created": "2022-03-05T07:00:00.000Z",
   "date_edited": "2022-03-05T07:00:00.000Z",
   "last_toggle": "2022-03-05T07:00:00.000Z"
}
```

## Endpoint: PUT api/flags/:id

body of the request:

```
{
   "name": "My new flag name"
}
```

response example:

```
{
   "id":6,
   "app_id":null,
   "name": "My new flag name",
   "description": null,
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

## Endpoint: GET api/flags/:id/experiments

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

For creating a new experiment. Request body should have the following fields in the example unless marked optional.
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

Request body should contain all updated fields and their new values. Can use this to end the experiment (to do this, set the "date_ended" to `true`), or to update other fields like duration, name, etc. When an experiment is ended, it automatically runs the analysis and will return the analysis instead.

Example for changing duration, name, and description:

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

Example for stopping an experiment:

```
{
    "date_ended": true
}
```

Response will contain the analysis data.

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

## Endpoint: GET api/flags/:id/custom-assignments

No request body needed

Successful response, if :id == 2:

```
{'2': { user123: false,  user888: false}}
```

## Endpoint: POST api/flags/:id/custom-assignments

Request body:

```
{ user8: true, user9: false}
```

Response, if :id == 1

```
{
    "1": {
        "user8": true,
        "user9": false
    }
}
```

## Endpoint: DELETE api/flags/:id/custom-assignments

Request body:

```
["userId1", "userId2"]
```

Response:

```
{flag_id: 1, user_ids: ["userId1", "userId2"] }
```
