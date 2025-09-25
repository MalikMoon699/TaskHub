// utils/databaseRetry.js
let retryCount = 0;
const maxRetries = 3;
const retryDelay = 5000; // 5 seconds

export const connectWithRetry = async (connectFunction) => {
  try {
    await connectFunction();
    retryCount = 0; // Reset retry count on successful connection
  } catch (error) {
    retryCount++;
    console.error(`MongoDB connection failed (attempt ${retryCount}):`, error);

    if (retryCount < maxRetries) {
      console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
      setTimeout(() => connectWithRetry(connectFunction), retryDelay);
    } else {
      console.error("Max retries reached. Could not connect to MongoDB.");
      throw error;
    }
  }
};
