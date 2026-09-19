const Favourite = require("../models/favourite");

const { deleteCacheByPattern, getCache, setCache } = require("../utils/redisCache");

exports.addFavourite = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const existingFavourite = await Favourite.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: "Job already added to favourites",
      });
    }

    const favourite = await Favourite.create({
      user: req.user.id,
      job: jobId,
    });
    await deleteCacheByPattern("/favourites:*");

    res.status(201).json({
      success: true,
      message: "Job added to favourites",
      data: favourite,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFavourite = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const favourite = await Favourite.findOneAndDelete({
      user: req.user.id,
      job: jobId,
    });

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: "Job not found in favourites",
      });
    }
    await deleteCacheByPattern("/favourites:*");

    res.status(200).json({
      success: true,
      message: "Job removed from favourites",
    });
  } catch (err) {
    next(err);
  }
};

exports.getFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cacheKey = `/favourites:${userId}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        message: "Favourite jobs",
        data: JSON.parse(cachedData),
      });
    }
    const favourites = await Favourite.find({
      user: userId,
    }).populate("job");

    await setCache(cacheKey, favourites, 240);

    res.status(200).json({
      success: true,
      message: "Favourite jobs",
      data: favourites,
    });
  } catch (err) {
    next(err);
  }
};