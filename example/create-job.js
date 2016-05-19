var Encoder = require('../index');
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY){
  throw new Error('required environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
}

var encoder = new Encoder(AWS_ACCESS_KEY_ID,
                          AWS_SECRET_ACCESS_KEY,
                          'eu-west-1',
                          '1463476983943-59pnhu',
                          'rave-media',
                          'rave-media');


var handleJobResult = function(err, jobResult){
  if (err) {
    switch (err) {
    case encoder.errAccessDenied:
      console.log('access denied for your user');
      return;
    case encoder.errAws:
      console.log('errAws: ' + encoder.errAws.message);
      return;
    }

    throw err;
  }

  console.log(JSON.stringify(jobResult));

  if (jobResult.Status === "Submitted" || jobResult.Status === "Progressing"){
    setTimeout(() => {
      encoder.readJob(jobResult.Id, handleJobResult);
    }, 2000);
  } else {
    console.log('success');
  }
};

encoder.createJob("src/file.mp3",
                  "dst/out.mp3",
                  // 128k
                  "1351620000001-300040",
                  handleJobResult);

// 128
// 1351620000001-300040

// 160
// 1351620000001-300030

// 192
// 1351620000001-300020

// 320
// 1351620000001-300010
