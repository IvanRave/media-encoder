'use strict';

/**
 * Result of a job
 *   received from createJob or readJob methods
 */
class JobResult{

  /**
   * Creates an instance
   * @param {Object} opts
   */
  constructor(opts, s3Service, awsRegion, outputBucketName){
    if (!opts.Output || !opts.Input){
      console.log(JSON.stringify(opts));
      throw new Error('no Output or Input');
    }
    
    /**
     * The identifier that Elastic Transcoder assigned to the job. You use this value to get settings for the job or to delete the job.
     * @example
     * 1463492156553-lf7b8g
     * @type {string}
     */
    this.Id = opts.Id;

    /**
     * The Amazon Resource Name (ARN) for the job.
     * @example
     * arn:aws:elastictranscoder:eu-west-1:081290220903:job/1463492156553-lf7b8g
     * @type {string}
     */
    this.Arn = opts.Arn;

    /**
     * The Id of the pipeline that you want Elastic Transcoder to use for transcoding
     * @type {string}
     */
    this.PipelineId = opts.PipelineId;
    
    /**
     * The status
     * Submitted | Progressing | (Complete | Error)
     * @type {string}
     */
    this.Status = opts.Output.Status;

    /**
     * Information that further explains Status
     * @type {string}
     */
    this.StatusDetail = opts.Output.StatusDetail;

    /**
     * Duration of the output file, in seconds.
     * @type {number}
     */
    this.Duration = opts.Output.Duration;

    /**
     * File size of the output file, in bytes.
     * @type {number}
     */
    this.FileSize = opts.Output.FileSize;

    /**
     * Destination file, like out128/file.mp3
     * @type {string}
     */
    this.DstFile = opts.Output.Key;

    /**
     * Path, like https://s3-eu-west-1.amazonaws.com/rave-media/
     * @type {string}
     */
    this.DstPath = "https://" + s3Service + "-" + awsRegion + ".amazonaws.com/" + outputBucketName + "/";
    
    /**
     * Source file
     * @type {string}
     */    
    this.SrcFile = opts.Input.Key;
  }
}

module.exports = JobResult;
