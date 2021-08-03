import * as AWS from 'aws-sdk';
import { v4 as UUID } from 'uuid';
import ResponseModel from '../models/response.model';
import * as fileType from 'file-type';
// import * as detectEncoding from 'detect-character-encoding';


const {
  DYNAMODB_ACCESS_KEY_ID,
  DYNAMODB_SECRET_ACCESS_KEY,
  BUCKET_NAME,
  DYNAMODB_REG
} = process.env;

AWS.config.update({
  accessKeyId: DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY,
  region:DYNAMODB_REG
});
//make sure you pass proper credentials
const s3 = new AWS.S3();
// Initializing S3 Interface

export default class FileUploadService {
 
  uploadFile = async (files,folder) => {
    const uploaded_files = []
    try {
      for (let i = 0; i < files.length; i++) {
        const fileName = UUID();
        const buffer = Buffer.from(files[i].content);
        const file_type = await fileType.fromBuffer(buffer);
        // const encoding = await detectEncoding(buffer)
        
        const params = {
          Bucket: BUCKET_NAME,
          Key: folder +'/'+ fileName,
          Body: buffer,
          // ContentEncoding: encoding,
          ContentType: file_type.mime
        };
        await s3.putObject(params).promise();
        uploaded_files.push(`https://bucket-name.s3.amazonaws.com/${folder}/${fileName}`)
      }
      
    } catch (error) {
      throw new ResponseModel({}, 500, `file-upload-error: ${error}`);
    }
    return uploaded_files;
  };

  deleteFile = async (fileName,folder) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: folder+'/'+fileName
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (error) {
        throw new ResponseModel({}, 500, `file-delete-error: ${error}`);
    }
  }
}
