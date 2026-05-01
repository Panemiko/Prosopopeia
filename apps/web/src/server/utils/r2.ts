import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@prosopopeia/env/server";

export const r2 = new S3({
  region: "auto",
  endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
});

export async function createPresignedUrl({
  filename,
  expiresIn,
  action,
}: {
  filename: string;
  expiresIn?: number;
  action: "PUT" | "GET";
}) {
  const command =
    action === "PUT"
      ? new PutObjectCommand({
          Bucket: "prosopopeia",
          Key: filename,
        })
      : new GetObjectCommand({
          Bucket: "prosopopeia",
          Key: filename,
        });

  return await getSignedUrl(r2, command, {
    expiresIn: expiresIn ?? 600,
  });
}
