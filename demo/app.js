const Maius = require('../dev/maius');

const app = new Maius({
  rootDir: __dirname,
});

app.run().then(() => {
  console.log('http://localhost:3123');
});
