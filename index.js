'use strict';

var AWS = require('aws-sdk');

var JobResult = require('./job-result');
var JobError = require('./job-error');

/**
 * Middleware to create and read jobs
 */
class Encoder{

  /**
   * Creates an instance
   * @param {string} AWS_ACCESS_KEY_ID
   * @param {string} AWS_SECRET_ACCESS_KEY
   * @param {string} awsRegion
   * @param {string} pipelineId
   */
  constructor(AWS_ACCESS_KEY_ID,
              AWS_SECRET_ACCESS_KEY,
              awsRegion,
              pipelineId){

    /**
     * The Id of the pipeline that you want Elastic Transcoder to use for transcoding. The pipeline determines several settings, including the Amazon S3 bucket from which Elastic Transcoder gets the files to transcode and the bucket into which Elastic Transcoder puts the transcoded files.
     * @type {string}
     */
    this.pipelineId = pipelineId;

    /**
     * Constructs a service interface object. Each API operation is exposed as a function on service.
     */
    this.etr = new AWS.ElasticTranscoder({
      region: awsRegion,
      apiVersion: '2012-09-25',
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      maxRetries: 3
    });

    /** Access denied */
    this.errAccessDenied = new JobError('AccessDeniedException');

    /** Unexpected: need to handle all errors */
    this.errUnexpected = new JobError('Unexpected');

    /**
     * AWS error for job processing. Set this error after error response.
     *   message = errorCode
     * {@link http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/error-handling.html}
     */
    this.errAws = null;
  }

  /**
   * Create a job: If you have specified more than one output for your jobs (for example, one output for the Kindle Fire and another output for the Apple iPhone 4s), you currently must use the Elastic Transcoder API to list the jobs (as opposed to the AWS Console).
   * @param {string} srcFile The name of the file to transcode. 
   *   If the file name includes a prefix, such as cooking/lasagna.mpg, include the prefix in the key. 
   *   If the file isn't in the specified bucket, Elastic Transcoder returns an error.
   * @param {string} dstFile The name to assign to the transcoded file. 
   *   If a file with the specified name already exists in the output bucket, the job fails.
   * @param {string} presetId The Id of the preset to use for this job. 
   *   The preset determines the audio, video, and thumbnail settings that Elastic Transcoder uses for transcoding.
   * @param {Encoder~jobCallback} next
   * @returns {Object} JSON data that includes the values that you specified plus information about the job that is created
   */
  createJob(srcFile, dstFile, presetId, next) {
    // A section of the request body that provides information about the file that is being transcoded.
    var inputParams = {
      Key: srcFile
    };

    var outputParams = {
      Key: dstFile,
      PresetId: presetId
    };

    // The value, if any, that you want Elastic Transcoder to prepend to the names of all files that this job creates, including output files, thumbnails, and playlists.
    //    OutputKeyPrefix: 'converted/'

    this.etr.createJob({
      PipelineId: this.pipelineId,
      Input: inputParams,
      Output: outputParams
    }, (err, data) => this.handleJob(err, data, next));
  }

  /**
   * @param {string} jobId
   * @param {Encoder~jobCallback} next
   * @return {Object} Detailed information about a job
   */
  readJob(jobId, next){
    this.etr.readJob({
      Id: jobId
    }, (err, data) => this.handleJob(err, data, next));
  }

  /**
   * Handle result of operations
   * @private
   * @param {Object} err This attribute is only filled if a service or networking error occurs.
   * {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Response.html#error-property}
   * @param {Object} data Response data, usually { Job: {} }
   * @param {Encoder~jobCallback} next
   */
  handleJob(err, data, next){
    if (err){
      console.log(err.statusCode, err.message);
      if (err.code === 'AccessDeniedException') {        
        next(this.errAccessDenied);
        return;
      } 

      next(this.errUnexpected);      
      return;
    } 

    var job = data.Job;
    // it a necessary field
    if (!job){
      next(this.errUnexpected);
      return;
    }

    // one job per time
    var output = job.Output;
    if (!output){
      next(this.errUnexpected);
      return;
    }
    
    // the same as job.Status
    if (output.Status === 'Error') {
      var detail = output.StatusDetail;
      if (!detail){
        next(this.errUnexpected);
        return;
      }
      
      // http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/error-handling.html      
      var errCode = parseInt(detail.split(' ')[0]);

      if (errCode) {
        this.errAws = new JobError(errCode);
        next(this.errAws);
        return;
      }
      
      // if (errCode === 3002) {
      //   next(this.errDuplicate);
      //   return;
      // }

      next(this.errUnexpected);
      return;
    }
    
    next(null, new JobResult(data.Job));
  }

  /**
   * Encoder callback
   * @callback Encoder~jobCallback
   * @param {JobError} err One of the encoder errors, e.g: errAccessDenied
   * @param {JobResult} jobResult
   */
}

module.exports = Encoder;
