// Models
import Post from "../Models/post.model.js";

export const createPost = async (req, res) => {
  const { content, media, platforms, status, scheduledAt } = req.body;
  const user = req.user;

  // Basic validation
  if (!content || !platforms || platforms.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Content and at least one platform are required",
    });
  }

  // Validate that user has connected all requested platforms
  const connectedPlatforms = user.connectedAccounts.map((acc) => acc.platform);
  const notConnected = platforms.filter((p) => !connectedPlatforms.includes(p));

  if (notConnected.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `You must connect the following platforms before posting: ${notConnected.join(
        ", "
      )}`,
    });
  }

  // Validate status
  const allowedStatuses = ["draft", "scheduled", "published"];
  let postStatus = status || "draft";
  if (!allowedStatuses.includes(postStatus)) {
    postStatus = "draft";
  }

  // If status is scheduled, scheduledAt must be provided
  if (postStatus === "scheduled" && !scheduledAt) {
    return res.status(400).json({
      status: "fail",
      message: "scheduledAt date is required for scheduled posts",
    });
  }

  try {
    const newPost = await Post.create({
      userId: user._id,
      content,
      media: media || [],
      platforms,
      status: postStatus,
      scheduledAt: scheduledAt || null,
      publishedAt: postStatus === "published" ? new Date() : null,
    });

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getPosts = async (req, res) => {
  const userId = req.user._id;

  const {
    status,
    platforms,
    scheduledFrom,
    scheduledTo,
    publishedFrom,
    publishedTo,
    limit = 10,
    page = 1,
  } = req.query;

  const query = { userId };

  // Filter by status
  if (status) {
    const allowedStatuses = ["draft", "scheduled", "published"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status filter",
      });
    }
    query.status = status;
  }

  // Filter by platforms
  if (platforms) {
    const platformsArray = platforms.split(",").map((p) => p.trim());

    query.platforms = { $in: platformsArray };
  }

  // Filter by scheduledAt
  if (scheduledFrom || scheduledTo) {
    query.scheduledAt = {};
    if (scheduledFrom) query.scheduledAt.$gte = new Date(scheduledFrom);
    if (scheduledTo) query.scheduledAt.$lte = new Date(scheduledTo);
  }

  // Filter by publishedAt
  if (publishedFrom || publishedTo) {
    query.publishedAt = {};
    if (publishedFrom) query.publishedAt.$gte = new Date(publishedFrom);
    if (publishedTo) query.publishedAt.$lte = new Date(publishedTo);
  }

  const numericLimit = parseInt(limit);
  const numericPage = parseInt(page);
  const skip = (numericPage - 1) * numericLimit;

  try {
    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(numericLimit);

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / numericLimit);

    // Success
    res.status(200).json({
      status: "success",
      data: {
        posts,
        pagination: {
          totalPosts,
          totalPages,
          currentPage: numericPage,
          limit: numericLimit,
        },
      },
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getPostById = async (req, res) => {
  const post = req.post;

  try {
    // Success
    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const editPost = async (req, res) => {
  const { post, user } = req;

  const { content, media, platforms, status, scheduledAt } = req.body;

  try {
    // Only update fields provided
    if (content !== undefined) post.content = content;
    if (media !== undefined) post.media = media;

    // Handle platform updates
    if (platforms !== undefined) {
      // Ensure user has connected all requested platforms
      const connectedPlatforms = user.connectedAccounts.map(
        (acc) => acc.platform
      );
      const notConnected = platforms.filter(
        (p) => !connectedPlatforms.includes(p)
      );

      if (notConnected.length > 0) {
        return res.status(400).json({
          status: "fail",
          message: `You must connect the following platforms before posting: ${notConnected.join(
            ", "
          )}`,
        });
      }

      post.platforms = platforms;
    }

    // Handle status updates
    if (status) {
      const allowedStatuses = ["draft", "scheduled", "published"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid status value",
        });
      }

      // Scheduled posts must have scheduledAt
      if (status === "scheduled" && !scheduledAt) {
        return res.status(400).json({
          status: "fail",
          message: "scheduledAt is required for scheduled posts",
        });
      }

      // Update publishedAt if marking as published
      if (status === "published") {
        if (!post.content || !post.platforms || post.platforms.length === 0) {
          return res.status(400).json({
            status: "fail",
            message: "Cannot publish a post without content or platforms",
          });
        }

        post.publishedAt = new Date();
        post.scheduledAt = undefined;
      }

      post.status = status;
    }

    // Update scheduledAt if provided
    if (scheduledAt !== undefined && post.status !== "published") {
      post.scheduledAt = scheduledAt;
    }

    const updatedPost = await post.save();

    // Success
    res.status(200).json({
      status: "success",
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  const post = req.post;

  try {
    await post.deleteOne();

    // Success
    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
