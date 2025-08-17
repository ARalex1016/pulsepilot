export const checkPostOwnership = (req, res, next) => {
  if (req.post?.userId.toString() !== req.user?._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Forbidden: You are not allowed to modify this post",
    });
  }

  next();
};
