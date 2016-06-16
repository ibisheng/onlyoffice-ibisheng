"use strict";

var g_oLicenseResult = {
  Error       : 1,
  Expired     : 2,
  Success     : 3,
  UnknownUser : 4,
  Connections : 5
};

var g_sLicenseDefaultUrl = "/license";
var g_sPublicRSAKey = '-----BEGIN CERTIFICATE-----MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9CzThoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQfVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/MLyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K3OK+u3ivTSj3zwjtpudY5Xo=-----END CERTIFICATE-----';

function CheckLicense(licenseUrl, customerId, userId, userFirstName, userLastName, callback) {
  callback(true, g_oLicenseResult.Success);
  return;

  licenseUrl = licenseUrl ? licenseUrl : g_sLicenseDefaultUrl;
  g_fGetJSZipUtils().getBinaryContent(licenseUrl, function(err, data) {
    if (err) {
      callback(true, g_oLicenseResult.Error);
      return;
    }

    try {
      var tmpSize;
      var maxSize = 0x4000;
      var sTextData = '';
      for (var i = 0; i < data.byteLength; i += maxSize) {
        tmpSize = data.byteLength - i;
        sTextData += String.fromCharCode.apply(null, new Uint8Array(data, i, (tmpSize < maxSize) ? tmpSize : maxSize));
      }
      var oLicense = JSON.parse(sTextData);

      var hSig = oLicense['signature'];
      delete oLicense['signature'];

      var x509 = new X509();
      x509.readCertPEM(g_sPublicRSAKey);
      var isValid = x509.subjectPublicKeyRSA.verifyString(JSON.stringify(oLicense), hSig);
      callback(false, isValid ? CheckUserInLicense(customerId, userId, userFirstName, userLastName, oLicense) : g_oLicenseResult.Error);
    } catch (e) {
      callback(true, g_oLicenseResult.Error);
    }
  });
}
/**
 *
 * @param customerId
 * @param userId
 * @param userFirstName
 * @param userLastName
 * @param oLicense
 * @returns {boolean}
 */
function CheckUserInLicense(customerId, userId, userFirstName, userLastName, oLicense) {
  var res = g_oLicenseResult.Error;
  var superuser = 'onlyoffice';
  try {
    if (oLicense['users']) {
      var userName = (null == userFirstName ? '' : userFirstName) + (null == userLastName ? '' : userLastName);
      var sUserHash = CryptoJS.SHA256(userId + userName).toString(CryptoJS.enc.Hex).toLowerCase();
      var checkUserHash = false;
      if (customerId === oLicense['customer_id'] || oLicense['customer_id'] === (sUserHash = superuser)) {
        // users для новой версии - массив
        checkUserHash = (-1 !== oLicense['users'].indexOf(sUserHash));
        res = g_oLicenseResult.UnknownUser;
      }
      if (checkUserHash) {
        var endDate = new Date(oLicense['end_date']);
        res = (endDate >= new Date()) ? g_oLicenseResult.Success : g_oLicenseResult.Expired;
      }
    }
  } catch (e) {
    res = g_oLicenseResult.Error;
  }
  return res;
}

AscCommon.baseEditorsApi.prototype._onCheckLicenseEnd = function(err, res) {
  this.licenseResult = {err: err, res: res};
  this._onEndPermissions();
};
AscCommon.baseEditorsApi.prototype._onEndPermissions = function() {
  if (this.isOnFirstConnectEnd && this.isOnLoadLicense) {
    var oResult = new AscCommon.asc_CAscEditorPermissions();
    if (null !== this.licenseResult) {
      oResult.asc_setCanLicense(g_oLicenseResult.Success === this.licenseResult);
      oResult.asc_setCanBranding(g_oLicenseResult.Error !== this.licenseResult); // Для тех, у кого есть лицензия, branding доступен
    }
    this.sendEvent('asc_onGetEditorPermissions', oResult);
  }
};