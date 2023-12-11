import setEnviroments from './set.envs';
setEnviroments();

export const envs_bucket_config = {
  accessKeyId: process.env.AWS_S3_ACCESSKEYID,
  secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY,
  region: process.env.AWS_S3_REGION,
  master_bucket: process.env.AWS_S3_MASTER_BUCKET,
};
