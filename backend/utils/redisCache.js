const redis = require("../config/redis");

exports.getCache = async (key) => {
  try {
    return await redis.get(key);
  } catch (err) {
    console.error("Redis GET error:", err.message);
    return null;
  }
};

exports.setCache = async (key, data, expiry = 60) => {
  try {
    await redis.set(
      key,
      JSON.stringify(data),
      "EX",
      expiry
    );
  } catch (err) {
    console.error("Redis SET error:", err.message);
  }
};

exports.deleteCacheByPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (err) {
    console.error("Redis cache invalidation error:", err.message);
  }
};