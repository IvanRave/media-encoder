describe('Encoder', function(){

  var Encoder = require('../index');
  var mockJobProgressing = require('./mocks/job-progressing');
  var mockJobError = require('./mocks/job-error');
  
  var encoder;
  
  beforeEach(function() {
    var AWS_ACCESS_KEY_ID = 'accesskeyid';
    var AWS_SECRET_ACCESS_KEY = 'nosecret';
    encoder = new Encoder(AWS_ACCESS_KEY_ID,
                          AWS_SECRET_ACCESS_KEY,
                          'eu-west-1',
                          'some-pipeline-id');
  });
  
  it('should progressing', function(done){
    encoder.handleJob(null, mockJobProgressing, function(jobError, jobResult){

      expect(jobResult.Id).toEqual(mockJobProgressing.Job.Id);      
      done();
    });
  });

  it('should error', function(done){
    encoder.handleJob(null, mockJobError, function(jobError, jobResult){

      expect(jobError).toEqual(encoder.errAws);
      expect(jobError.message).toEqual('3002');
      done();
    });
  });
});
