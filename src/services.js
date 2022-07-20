import React from 'react'
import { useState } from "react";
import { Constants } from './constants';
import * as DynamoDB from  'react-dynamodb-helper';
import * as SesHelper from 'react-ses-helper';

async function getCredentials(region, secret, key, email) {

    var paramsCredentials = {
    TableName: "Account_Credentials",
    Key : { 
        "email" : email,
    }
    };

    let resultCredentials = await DynamoDB.getData(region, secret, key, paramsCredentials)
    return resultCredentials;

}

async function resetOtpExpiry(region, secret, key, email) {
    let paramsUpdateCredentials = {
        TableName: "Account_Credentials",
        Key:{
            email: email
        },
        UpdateExpression: "set #otp = :otpVal, #expiry = :expiry",
        ExpressionAttributeNames: {
            "#otp": "otp",
            "#expiry": "expiry",
        },
        ExpressionAttributeValues: {
            ":otpVal": '',
            ":expiry": ''
        }
      }

    await DynamoDB.updateData(region, secret, key, paramsUpdateCredentials)
}

async function updateToken(region, secret, key, email, tokenArr) {

    let paramsUpdateTokens = {
    TableName: "Account_Credentials",
    Key:{
        email: email
    },
    UpdateExpression: "set #otp = :otpVal, #expiry = :expiry, #tokens = :tokens",
    ExpressionAttributeNames: {
        "#otp": "otp",
        "#expiry": "expiry",
        "#tokens": "tokens",
    },
    ExpressionAttributeValues: {
        ":otpVal": '',
        ":expiry": '',
        ":tokens": tokenArr
    }
    }

    await DynamoDB.updateData(region, secret, key, paramsUpdateTokens)

}

async function updateOtpExpiry(region, secret, key, email, otp, expiry) {

    let paramsUpdateCredentials = {
        TableName: "Account_Credentials",
        Key:{
            email: email
        },
        UpdateExpression: "set #otp = :otpVal, #expiry = :expiry",
        ExpressionAttributeNames: {
            "#otp": "otp",
            "#expiry": "expiry",
        },
        ExpressionAttributeValues: {
            ":otpVal": otp,
            ":expiry": expiry
        }
    }

    await DynamoDB.updateData(region, secret, key, paramsUpdateCredentials)
    
}

const exportFunctions = {
    getCredentials,
    resetOtpExpiry,
    updateToken,
    updateOtpExpiry
};

export default exportFunctions;

