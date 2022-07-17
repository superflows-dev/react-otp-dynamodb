# react-otp-dynamodb

> An OTP component from the sign in flow, uses dynamodb as the backend

[![NPM](https://img.shields.io/npm/v/react-otp-dynamodb.svg)](https://www.npmjs.com/package/react-otp-dynamodb) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-otp-dynamodb
```

## Dependencies

```bash
npm install --save aws-sdk
npm install --save bootstrap
npm install --save react-bootstrap
npm install --save react-dynamodb-helper
npm install --save react-ses-helper
npm install --save react-ui-components-superflows
```

## Note

### AWS key pair needs to have DynamoDb & SES privileges
### For SES to work a template needs to be in place, for more information see the react-ses-helper npm

## Usage

```jsx

import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Otp } from 'react-otp-dynamodb'

const App = () => {

  function processAccount(email, exists) {
    console.log(email, exists);
  }

  return  (
  
    <Otp  
      imageUrl="https://**********/superflows_black.png" 
      imageAlt="This is a test image"
      buttonCaption="Verify"
      onSubmitResult={processAccount}
      awsRegion="aws_region"
      awsSecret="aws_secret"
      awsKey="aws_key"
      template="TemplateOtp1"
      project="SF-21"
      emailerSource="sup****************@****ail.com"
      email="hru********n**e@***ail.com"
      captionInfo={"One time password (otp) has been sent to hr********@**il.com"}
    />

  )
}

export default App


```

## License

MIT © [superflows-dev](https://github.com/superflows-dev)
