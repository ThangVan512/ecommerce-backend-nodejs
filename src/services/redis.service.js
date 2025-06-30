"use strict";

const redis = require("redis");
const { getProductById } = require("../models/repositories/product.repo");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`; // Fixed: use backticks for template string
  const retryTime = 10;
  const expireTime = 3; // 3 seconds for EXPIRE in seconds (Redis v4+)
  for (let i = 0; i < retryTime; i++) {
    const result = await redisClient.setNX(
      key,
      JSON.stringify({ productId, quantity, cartId })
    );
    if (result) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (!isReservation) {
        await releaseLock(key);
        throw new Error(`Failed to reserve inventory for product ${productId}`);
      }
      if (isReservation.modifiedCount > 0) {
        await redisClient.expire(key, expireTime); // Set expiration in seconds
        return key;
      }
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

const releaseLock = async (key) => {
  return await redisClient.del(key);
};

module.exports = {
  acquireLock,
  releaseLock,
};
