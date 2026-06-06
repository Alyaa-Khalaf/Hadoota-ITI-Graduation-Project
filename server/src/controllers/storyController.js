import Story from "../models/storyModel.js";
import Favorite from "../models/favoriteModel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import {
  parsePagination,
  buildPaginationMeta,
  buildSearchQuery,
  buildFilterQuery,
  fetchStoriesWithSort,
  getFavoriteStoryIds,
  attachFavoriteFlag,
} from "../services/storyService.js";

const validateSort = (sort) => {
  const allowed = ["latest", "views", "favorites"];
  return allowed.includes(sort) ? sort : "latest";
};

// GET /api/stories/search?q=...&childId=...
export const searchStories = async (req, res) => {
  try {
    const { q, sort = "latest" } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    if (!q || !q.trim()) {
      return sendError(res, 400, "Search query q is required");
    }

    const query = buildSearchQuery(q);
    const { stories, total } = await fetchStoriesWithSort(query, {
      sort: validateSort(sort),
      skip,
      limit,
    });

    const favoriteIds = await getFavoriteStoryIds(
      req.child._id,
      stories.map((story) => story._id)
    );

    return sendSuccess(res, 200, "Stories search completed successfully", {
      stories: attachFavoriteFlag(stories, favoriteIds),
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/stories/filter?character=...&topic=...&childId=...
export const filterStories = async (req, res) => {
  try {
    const { character, topic, fromDate, toDate, sort = "latest" } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    if (!character?.trim() && !topic?.trim() && !fromDate && !toDate) {
      return sendError(
        res,
        400,
        "At least one filter is required: character, topic, fromDate, or toDate"
      );
    }

    const query = buildFilterQuery({ character, topic, fromDate, toDate });
    const { stories, total } = await fetchStoriesWithSort(query, {
      sort: validateSort(sort),
      skip,
      limit,
    });

    const favoriteIds = await getFavoriteStoryIds(
      req.child._id,
      stories.map((story) => story._id)
    );

    return sendSuccess(res, 200, "Stories filtered successfully", {
      stories: attachFavoriteFlag(stories, favoriteIds),
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/stories/:childId/favorites
export const getFavoriteStories = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const childId = req.child._id;

    const [favorites, total] = await Promise.all([
      Favorite.find({ childId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("storyId")
        .lean(),
      Favorite.countDocuments({ childId }),
    ]);

    const stories = favorites
      .filter((item) => item.storyId)
      .map((item) => ({
        ...item.storyId,
        isFavorite: true,
        favoritedAt: item.createdAt,
      }));

    return sendSuccess(res, 200, "Favorite stories fetched successfully", {
      stories,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// POST /api/stories/:id/favorite
export const addFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const childId = req.body.childId || req.query.childId;

    if (!childId) {
      return sendError(res, 400, "childId is required");
    }

    const story = await Story.findById(id);
    if (!story) {
      return sendError(res, 404, "Story not found");
    }

    const existing = await Favorite.findOne({ childId, storyId: id });
    if (existing) {
      return sendError(res, 400, "Story is already in favorites");
    }

    const favorite = await Favorite.create({ childId, storyId: id });

    return sendSuccess(res, 201, "Story added to favorites", {
      favoriteId: favorite._id,
      storyId: id,
      childId,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// DELETE /api/stories/:id/favorite
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const childId = req.query.childId || req.body.childId;

    if (!childId) {
      return sendError(res, 400, "childId is required");
    }

    const favorite = await Favorite.findOneAndDelete({ childId, storyId: id });
    if (!favorite) {
      return sendError(res, 404, "Favorite not found");
    }

    return sendSuccess(res, 200, "Story removed from favorites", {
      storyId: id,
      childId,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
