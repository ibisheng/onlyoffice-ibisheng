/*
 * (c) Copyright Ascensio System SIA 2010-2016
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

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
AscCommon.baseEditorsApi.prototype._onEndPermissions = function () {
  if (this.isOnFirstConnectEnd && this.isOnLoadLicense) {
    var oResult = new AscCommon.asc_CAscEditorPermissions();
    if (null !== this.licenseResult) {
      var type = this.licenseResult['type'];
      oResult.asc_setCanLicense(g_oLicenseResult.Success === type);
      oResult.asc_setCanBranding(g_oLicenseResult.Error !== type); // Для тех, у кого есть лицензия, branding доступен
      oResult.asc_setCanBranding(g_oLicenseResult.Error !== type); // Для тех, у кого есть лицензия, branding доступен
      oResult.asc_setIsLight(this.licenseResult['light']);
    }
    this.sendEvent('asc_onGetEditorPermissions', oResult);
  }
};
