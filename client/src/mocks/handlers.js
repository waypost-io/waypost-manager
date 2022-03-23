import { rest } from 'msw';

export const handlers = [
  rest.get('/api/flags', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      {
        id: 1,
        name: "Test Flag 1",
        description: "A detailed description",
        status: true,
        percentage_split: 50,
      },
      {
        id: 2,
        name: "Test Flag 2",
        description: "Another description",
        status: false,
        percentage_split: 50,
      },
    ]));
  }),
  rest.get('/api/connection', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ connected: true, database: 'postgres' }));
  }),
  rest.get('/api/metrics', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(
      [
        {
          id: 1,
          name: "Signups",
          query_string: "SELECT * FROM signups;",
          type: "binomial"
        },
        {
          id: 2,
          name: "Time on site",
          query_string: "SELECT * FROM time_on_site;",
          type: "duration"
        }
      ]
    ));
  }),
  rest.get('/api/log', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      {
        id: 1,
        flag_id: 1,
        flag_name: "Test Flag 1",
        event_type: "FLAG_TOGGLED",
        timestamp: "2022-03-21T19:29:37.649Z"
      },
      {
        id: 2,
        flag_id: 2,
        flag_name: "Test Flag 2",
        event_type: "FLAG_CREATED",
        timestamp: "2022-03-21T19:29:24.306Z"
      }
    ]));
  }),
  rest.get('/api/flags/:id/experiments', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      {
        id: 1,
        flag_id: req.params.id,
        date_started: "2022-03-14T07:00:00.000Z",
        date_ended: null,
        duration: 30,
        hash_offset: 83,
        name: "Experiment 1",
        description: "Description for expt 1",
        metrics: [
          {
            metric_id: 1,
            name: "Signups",
            type: "binomial"
          },
          {
            metric_id: 2,
            name: "Time on site",
            type: "duration"
          }
        ],
        mean_test: null,
        mean_control: null,
        standard_dev_test: null,
        standard_dev_control: null,
        p_value: null
      }
    ]));
  })
];