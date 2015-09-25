"use strict";

var g_sLicenseDefaultUrl = "/license";
var g_sPublicRSAKey = '-----BEGIN CERTIFICATE-----MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9CzThoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQfVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/MLyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K3OK+u3ivTSj3zwjtpudY5Xo=-----END CERTIFICATE-----';
var g_sAESKey = '7f3d2338390c1e3e154c21005f51010e065b0f1a1e101600202473150c022a11';

function CheckLicense(licenseUrl, userId, callback) {
  licenseUrl = licenseUrl ? licenseUrl : g_sLicenseDefaultUrl;
  require('jsziputils').getBinaryContent(licenseUrl, function(err, data) {
    if (err) {
      callback(true, false);
      return;
    }

    try {
      var base64TextData = String.fromCharCode.apply(null, new Uint8Array(data));
      var decrypted = CryptoJS.AES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(base64TextData),
        salt: ""
      }, CryptoJS.enc.Hex.parse(g_sAESKey), {iv: CryptoJS.enc.Hex.parse(g_sAESKey.slice(0, g_sAESKey.length / 2))});
      var sJson = decrypted.toString(CryptoJS.enc.Utf8);
      var oLicense = JSON.parse(sJson);

      var hSig = oLicense.signature;
      delete oLicense.signature;

      var x509 = new X509();
      x509.readCertPEM(g_sPublicRSAKey);
      var isValid = x509.subjectPublicKeyRSA.verifyString(JSON.stringify(oLicense), hSig);
      callback(false, isValid ? CheckUserInLicense(userId, oLicense) : false);
    } catch(e) {
      callback(true, false);
    }
  });
}
/**
 *
 * @param userId
 * @param oLicense
 * @returns {boolean}
 */
function CheckUserInLicense(userId, oLicense) {
  var res = false;
  try {
    if ('onlyoffice' === oLicense['company_id']) {
      res = true;
    } else if (oLicense.users && oLicense.users.hasOwnProperty(userId)) {
      var endDate = new Date(oLicense.users[userId]);
      res = endDate >= new Date();
    }
  } catch(e) {
    res = false;
  }
  return res;
}