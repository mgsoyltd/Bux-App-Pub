/**
 * Check mandatory environment variables
 */
const checkEnv = () => {

  // console.log(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);

  if (
    // Bux API 
    typeof process.env.REACT_APP_API_URL === "undefined" || !process.env.REACT_APP_API_URL ||
    // Cloudinary API
    typeof process.env.REACT_APP_API_BASE_URL === "undefined" || !process.env.REACT_APP_API_BASE_URL ||
    typeof process.env.REACT_APP_API_KEY === "undefined" || !process.env.REACT_APP_API_KEY ||
    typeof process.env.REACT_APP_API_UPLOAD_PRESET === "undefined" || !process.env.REACT_APP_API_UPLOAD_PRESET ||
    typeof process.env.REACT_APP_API_CLOUD_NAME === "undefined" || !process.env.REACT_APP_API_CLOUD_NAME ||
    typeof process.env.REACT_APP_API_SECRET === "undefined" || !process.env.REACT_APP_API_SECRET
  ) {
    console.log("<<< PLEASE, MAINTAIN ALL REQUIRED API ENVIRONMENT VARIABLES >>>");
    throw Error("Missing API Environment Variables!");
  }
}

export default checkEnv;