const app = require("./app");

const PORT = 3055;
const serrver = app.listen(PORT, () => {
  console.log(`WSV eCommerce is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
    serrver.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
})