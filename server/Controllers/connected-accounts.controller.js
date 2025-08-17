// Models
import User from "../Models/user.model.js";

export const connectAccount = async (req, res) => {
  const { user } = req;

  const { platform, accountId } = req.body;

  if (!platform || !accountId) {
    return res.status(400).json({
      status: "error",
      message: "Platform and accountId are required",
    });
  }

  try {
    // Check if account already connected
    const existingAccount = user.connectedAccounts.find(
      (acc) => acc.platform === platform && acc.accountId === accountId
    );
    if (existingAccount) {
      return res
        .status(409)
        .json({ message: "This account is already connected." });
    }

    //  Add new connected account
    user.connectedAccounts.push({ platform, accountId });

    //  Save user
    await user.save();

    // Success
    res.status(200).json({
      status: "success",
      message: "Account connected successfully.",
      data: user,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAccounts = async (req, res) => {
  const { user } = req;

  try {
    // Success
    res.status(200).json({
      status: "success",
      message: "Connected accounts retrieved successfully.",
      data: user.connectedAccounts,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const disconnectPlatform = async (req, res) => {
  const { user } = req;

  const { platform } = req.body;

  if (!platform) {
    return res.status(400).json({ message: "Platform is required." });
  }

  // Check if the platform exists
  const accountIndex = user.connectedAccounts.findIndex(
    (acc) => acc.platform === platform
  );

  if (accountIndex === -1) {
    return res.status(404).json({ message: "Connected account not found." });
  }

  // Remove the account
  user.connectedAccounts.splice(accountIndex, 1);

  // Save changes
  await user.save();

  try {
    // Success
    res.status(200).json({
      status: "success",
      message: `Successfully disconnected ${platform}.`,
      user,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
