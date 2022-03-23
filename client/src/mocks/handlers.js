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
    return res(ctx.status(200), ctx.json({ connected: true, database: 'postgres' }))
  })
];