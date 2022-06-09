const AWS = require("aws-sdk");
const { v5 } = require("uuid");
const debug = require("debug")("app:S3");

const uuidV5 = v5;
const accessKeyId = process.env.S3_KEY;
const secretAccessKey = process.env.S3_SECRET;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET;

/**
 *
 *
 * @param {ArrayBuffer} file
 * @param {string} ext
 * @param {string} ContentType it is the file type image/png or any
 * @param {boolean} isPublic boolean to set the uploaded file ACL
 * @param {*} [config={
 *   region: region,
 *   accessKeyId: accessKeyId,
 *   secretAccessKey: secretAccessKey,
 *   bucket: bucket,
 * }]
 * @returns
 */
async function uploadToS3(
  file,
  ext,
  ContentType,
  isPublic = true,
  config = {
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    logger: debug,
  }
) {
  const hashedFileName = uuidV5(`${file}${Date.now()}`, uuidV5.URL);

  const s3 = new AWS.S3(config.region ? config : null);

  const params = {
    Bucket: config.bucket,
    Body: file,
    ACL: isPublic ? "public-read" : null,
    Key: `${hashedFileName}${ext}`,
    ContentType,
  };

  const { Location } = await s3.upload(params).promise();
  return Location;
}

/**
 *
 *
 * @param {string} fileLocation the full URL of the file
 * @returns {string} file key
 */
function getFileKeyFromS3Location(fileLocation) {
  return fileLocation.split("amazonaws.com/")[1];
}

/**
 *
 *
 * @param {string} imageName
 * @param {*} [config={
 *   region: region,
 *   accessKeyId: accessKeyId,
 *   secretAccessKey: secretAccessKey,
 *   bucket: bucket,
 * }]
 * @returns
 */
async function deleteFromS3(
  imageName,
  config = {
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    logger: debug,
  }
) {
  const s3 = new AWS.S3(config.region ? config : null);
  const params = { Bucket: config.bucket, Key: imageName };

  try {
    const { $response } = await s3.deleteObject(params).promise();
    return $response;
  } catch (error) {
    debug(error);
    return new Error(error.message);
  }
}

/**
 *
 *
 * @param {string} fileKey
 * @param {number} Expires time to expire in seconds
 * @param {*} [config={
 *   region: region,
 *   accessKeyId: accessKeyId,
 *   secretAccessKey: secretAccessKey,
 *   bucket: bucket,
 * }]
 * @returns
 */
function getSignedUrl(
  fileKey,
  Expires,
  config = {
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    signatureVersion: "v4",
    logger: debug,
  }
) {
  if (typeof Expires !== "number") throw Error("Expires must be a number");
  if (Expires > 604800) throw Error("expiry time must be less than a week");

  const s3 = new AWS.S3(config);
  const params = { Bucket: config.bucket, Key: fileKey, Expires };

  return s3.getSignedUrl("getObject", params);
}

module.exports = {
  uploadToS3,
  deleteFromS3,
  getFileKeyFromS3Location,
  getSignedUrl,
};
