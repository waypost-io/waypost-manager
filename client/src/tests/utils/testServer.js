import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';

const server = setupServer(...handlers);

exports.server = server;
exports.rest = rest;