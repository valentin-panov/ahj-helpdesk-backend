const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const idGenerator = require('./idGenerator');

const tickets = [
  {
    id: idGenerator.generateId(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ 1210, картриджи на складе',
    status: false,
    created: Date.now(),
  },
  {
    id: idGenerator.generateId(),
    name: 'Переустановить Windows, ПК-Hall24',
    description: 'Развернуть образ и закрыть все админские права',
    status: false,
    created: Date.now(),
  },
  {
    id: idGenerator.generateId(),
    name: 'Установить обновление KB-XXX',
    description: 'Накатить и включить уже автоматические апдейты',
    status: false,
    created: Date.now(),
  },
];

const serverEngine = new Koa();

serverEngine.use(cors());
serverEngine.use(koaBody({ urlencoded: true, multipart: true }));

serverEngine.use(async (ctx) => {
  const { method, id } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((ticket) => ticket.id === id);
      return;
    case 'createTicket':
      const newTicketData = JSON.parse(ctx.request.body);
      const newTicket = {
        id: idGenerator.generateId(),
        name: newTicketData.name,
        status: false,
        description: newTicketData.description || '',
        created: Date.now(),
      };
      tickets.push(newTicket);
      ctx.response.body = [newTicket];
      return;
    case 'deleteById':
      const deleteID = tickets.findIndex((ticket) => ticket.id === id);
      tickets.splice(deleteID, 1);
      ctx.response.body = tickets;
      return;
    case 'updateById':
      const updIndex = tickets.findIndex((ticket) => ticket.id === id);
      const updTicketData = JSON.parse(ctx.request.body);
      // ! strange logic
      const ticket = {
        ...tickets[updIndex],
        ...updTicketData,
      };
      console.log(ticket);
      tickets.splice(updIndex, 1, ticket);
      ctx.response.body = tickets;
      return;
    default:
      ctx.response.status = 404;
      return;
  }
});

module.exports = serverEngine;
