import crypto from 'crypto';
require('dotenv').config();

const baseUrl = process.env.REACT_APP_API_BASE_URL;

/**
 * Upload signed image to Cloudinary using REST API
 * @param {*} image     Image data
 * @returns {Url|null}  Image URL
 */
export const uploadImageSigned = async (image) => {

  // console.log(process.env);

  // Get the timestamp in seconds
  const timestamp = Math.round((new Date()).getTime() / 1000);
  // console.log('Timestamp:', timestamp);

  // Create the signature
  // 'timestamp=1621937214&upload_preset=presetname'
  // e.g. c_scale,w_512  when needed special scaling
  const payload =
    "timestamp=" + timestamp.toString()
    + "&upload_preset=" + process.env.REACT_APP_API_UPLOAD_PRESET
    + process.env.REACT_APP_API_SECRET;

  // Create SHA256 signature
  const signature = crypto.createHash('sha256').update(payload).digest('hex');

  // console.log("Payload:", payload);
  // console.log('Signature:', signature);

  const data = new FormData()
  data.append("file", image)
  data.append("api_key", process.env.REACT_APP_API_KEY)
  data.append("timestamp", timestamp)
  data.append("signature", signature)
  data.append("upload_preset", process.env.REACT_APP_API_UPLOAD_PRESET)
  data.append("cloud_name", process.env.REACT_APP_API_CLOUD_NAME)

  // Post the image to the cloud
  try {
    const response = await fetch(baseUrl, { method: "post", body: data });
    const res = await response.json();
    // console.log("<<FETCH>>", res);
    return res.secure_url;
  } catch (err) {
    console.log("fetch", err);
  }
  return null;
}

/**
 * Upload unsigned image to Cloudinary using REST API
 * @param {*} image     Image data
 * @returns {Url|null}  Image URL
 */
export const uploadImageUnsigned = async (image) => {

  const data = new FormData()
  data.append("file", image)
  data.append("upload_preset", process.env.REACT_APP_API_UPLOAD_PRESET)
  data.append("cloud_name", process.env.REACT_APP_API_CLOUD_NAME)

  // Post the image to the cloud
  try {
    const response = await fetch(baseUrl, { method: "post", body: data });
    const res = await response.json();
    console.log(res);
    return res.secure_url;
  } catch (err) {
    console.log(err);
    return null;
  }

}

/* Data returned from upload
asset_id: "2761ea8b057bcbd738c4957509536e5b", public_id: "yvuntbzcepsibmcejtfb", version: 1621883640, version_id: "f64c16d6069a4ff0934309e9b4f93b57", signature: "75a879323599b871754f978af661fe4636564ee8", …}
asset_id: "2761ea8b057bcbd738c4957509536e5b"
bytes: 46791
created_at: "2021-05-24T19:14:00Z"
etag: "986746d7ccea84f559ea4356e6ad7102"
format: "jpg"
height: 324
original_filename: "kidstoschool"
placeholder: false
public_id: "yvuntbzcepsibmcejtfb"
resource_type: "image"
secure_url: "https://res.cloudinary.com/dyq0bvuqg/image/upload/v1621883640/yvuntbzcepsibmcejtfb.jpg"
signature: "75a879323599b871754f978af661fe4636564ee8"
tags: []
type: "upload"
url: "http://res.cloudinary.com/dyq0bvuqg/image/upload/v1621883640/yvuntbzcepsibmcejtfb.jpg"
version: 1621883640
version_id: "f64c16d6069a4ff0934309e9b4f93b57"
width: 500
*/