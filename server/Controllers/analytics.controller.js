export const getPostAnalytics = async (req, res) => {
  try {
    // Success
    res.status().json({
      status: "success",
      message: "",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getSummary = async (req, res) => {
  try {
    // Success
    res.status().json({
      status: "success",
      message: "",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
