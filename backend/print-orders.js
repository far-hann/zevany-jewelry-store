// print-orders.js
const sql = require('./config/postgresClient');
(async () => {
  try {
    const orders = await sql`SELECT id, user_id, order_items, created_at FROM orders ORDER BY created_at DESC LIMIT 10`;
    console.log(JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
