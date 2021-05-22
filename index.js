const serverEngine = require('./serverEngine');

const port = process.env.PORT || 3000;

async function start() {
  try {
    serverEngine.listen(port, () => console.log(`Server run on ${port} port.`));
  } catch (err) {
    console.error(err);
  }
}

start();
