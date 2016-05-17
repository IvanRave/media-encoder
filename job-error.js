'use strict';

/**
 * Job error
 * {@link http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax}
 */
class JobError extends Error{
  constructor(msg){    
    super(msg);
  }
}

module.exports = JobError;
