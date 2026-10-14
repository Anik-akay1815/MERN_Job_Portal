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
    let cursor = "0";
    do {
      const result = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        await redis.del(keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    console.error("Redis cache invalidation error:", err.message);
  }
};

exports.acquireLock = async (key, token, expiry = 10) => {
  try {
    return await redis.set(key, token, "NX", "EX", expiry);
  } catch (err) {
    console.error("Redis LOCK error:", err.message);
    return null;
  }
};

exports.releaseLock = async (key, token) => {
  try {
    await redis.eval(
      `if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end`,
      1,
      key,
      token
    );
  } catch (err) {
    console.error("Redis UNLOCK error:", err.message);
  }
};