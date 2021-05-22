const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const generateId = require('./idGenerator');
const formatDate = require('./formatDate');

const tickets = [
  {
    id: generateId(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ 1210, картриджи на складе',
    status: false,
    created: formatDate(new Date()),
  },
  {
    id: generateId(),
    name: 'Переустановить Windows, ПК-Hall24',
    description: 'Развернуть образ и закрыть все админские права',
    status: false,
    created: formatDate(new Date()),
  },
  {
    id: generateId(),
    name: 'Установить обновление KB-XXX',
    description:
      'Вышло критическое обновление Windows, нужно поставить обновления в следующем приоритете:<br>1. Сервера (не забыть сделать бэкап!)<br>2. Рабочие станции',
    status: false,
    created: formatDate(new Date()),
  },
];

const serverEngine = new Koa();

serverEngine.use(
  cors({
    origin: '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'allTickets'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);
serverEngine.use(koaBody({ urlencoded: true, multipart: true }));

serverEngine.use(async (ctx) => {
  const { method, id } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'createTicket':
      const newTicketData = ctx.request.body;
      const newTicket = {
        id: generateId(),
        name: newTicketData.name,
        status: false,
        description: newTicketData.description || '',
        created: formatDate(Date.now()),
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
      const updTicketData = ctx.request.body;
      const ticket = {
        ...tickets[updIndex],
        ...updTicketData,
      };
      tickets.splice(updIndex, 1, ticket);
      ctx.response.body = tickets;
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((ticket) => ticket.id === id);
      return;
    default:
      ctx.response.status = 404;
      return;
  }
});

module.exports = serverEngine;
