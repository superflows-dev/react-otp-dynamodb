import React from 'react'
import { useState } from "react";
import { Constants } from './constants';
import { VSpace, InputOtp, LogoMast, AlertError, ButtonNext, ButtonTimer, AlertSuccess, InfoBlock } from 'react-ui-components-superflows';
import * as DynamoDB from  'react-dynamodb-helper';
import * as SesHelper from 'react-ses-helper';
import Services from './services';

import { Col, Row, Button, Container } from 'react-bootstrap';

export const Otp = (props) => {

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [switchResendSuccess, setSwitchResendSuccess] = useState(0);

  function generateOTP() {

    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;

  }

  function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }


  async function onResend() {

    const resultCredentials = await Services.getCredentials(props.awsRegion, props.awsSecret, props.awsKey, props.email);

    if(resultCredentials.Item == null) {

      setError(Constants.ERROR_EMAIL_NOT_FOUND)
      if(props.onSubmitResult != null) props.onSubmitResult(otp, '', false);

    } else {

      const otpRegen = generateOTP();
      const expiry = parseInt(new Date().getTime()/1000) + 24*60*60;

      await Services.updateOtpExpiry(props.awsRegion, props.awsSecret, props.awsKey, props.email, otpRegen, expiry)

      SesHelper.sendTemplatedEmail(props.awsRegion, props.awsSecret, props.awsKey, props.emailerSource,[props.email], [], props.template, "{\"project\": \"" + props.project + "\", \"name\": \"" + resultCredentials.Item.firstName + "\", \"otp\": \"" + otpRegen + "\"}", [])

      setSwitchResendSuccess(5);
      setTimeout(() => {
        setSwitchResendSuccess(0);
      }, 5000)

    }

  }

  const onClick = async ()  => {

    setError("")
        
    const resultCredentials = await Services.getCredentials(props.awsRegion, props.awsSecret, props.awsKey, props.email);
    
    if(resultCredentials.Item == null) {

      setError(Constants.ERROR_EMAIL_NOT_FOUND)
      if(props.onSubmitResult != null) props.onSubmitResult(otp, '', false);

    } else {

      const currTime = parseInt(new Date().getTime()/1000)
      if(currTime > parseInt(resultCredentials.Item.expiry)) {

        setError(Constants.ERROR_EXPIRED_OTP)
        if(props.onSubmitResult != null) props.onSubmitResult(props.email, '', false);

      } else {

        if(otp == resultCredentials.Item.otp) {

          await Services.resetOtpExpiry(props.awsRegion, props.awsSecret, props.awsKey, props.email)
  
          const uuid = generateUUID();

          var tokenArr = resultCredentials.Item.tokens;
          if(tokenArr != null) {

          } else {
            tokenArr = [];
          }

          tokenArr.push(uuid);

          await Services.updateToken(props.awsRegion, props.awsSecret, props.awsKey, props.email, tokenArr);

          if(props.onSubmitResult != null) props.onSubmitResult(props.email, uuid, true);
          
        } else {
          setError(Constants.ERROR_INCORRECT_OTP)
          if(props.onSubmitResult != null) props.onSubmitResult(props.email, false);
        }

      }

      
    }

  }


  return (

    <Container>
      <Row className='justify-content-center'>
        <Col sm={10} xs={10} md={6} xl={4} xxl={4}>

          <VSpace />
          <LogoMast imageUrl={props.imageUrl} imageAlt={props.imageAlt} />
          <VSpace />
          <InfoBlock caption={props.captionInfo} />
          <VSpace />
          <InputOtp setValue={setOtp} autofocus={true} onEnterPressed={() => {onClick()}}/>
          <AlertError caption={error}/>
          {switchResendSuccess > 0 && 
          <div>
            <AlertSuccess caption="OTP resent successfully" />
          </div>
          }
          <VSpace />
          <ButtonTimer timer={30} captionBefore="Resend OTP in " captionAfter="Resend OTP" onClick={() => {onResend()}}/>
          <VSpace />
          <ButtonNext caption={props.buttonCaption} disabled={otp.length === 0} onClick={() => {onClick()}}/>

        </Col>
      </Row>
    </Container>

  )
}
