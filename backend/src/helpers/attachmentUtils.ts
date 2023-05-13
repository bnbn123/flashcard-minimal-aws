import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpireTime = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = s3Bucket
  ) {}

  getAttachmentUrl(flashCardId: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${flashCardId}`
  }

  getUploadUrl(flashCardId: string): string {
    const signedUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: flashCardId,
      Expires: parseInt(urlExpireTime)
    })

    return signedUrl
  }
}
