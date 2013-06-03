//----------------------------------------------------------------------------------------------------------------------
var UserTableChangeSizes        =   1001;
var UserTableChangePosition     =   1002;
var UserTableChangeStructure    =   2001;
var UserTableScrollItems        =   2012;

var SystemReleaseSelectedItems  =   30001;
var SystemMergeSelectedItems    =   30101;
var SystemUnmergeSelectedItems  =   30102;

var NeeedDisplayUpdate          =   9999;


// table mode


//----------------------------------------------------------------------------------------------------------------------
var Recepient = function(){
    this.innerObjs = [];
    this.idNotifity = "";
};
var NotifityManager = function(){
    var recipients = null;
};
NotifityManager.bind = function(obj,idMsg){
    if (undefined==NotifityManager.recipients)
        NotifityManager.recipients = [];

    for (var i = 0; i< NotifityManager.recipients.length;++i){
        if(NotifityManager.recipients[i].idNotifity == idMsg) {
            NotifityManager.recipients[i].innerObjs.push(obj);
            return;
        }
    }

    var objToPush = new Recepient();

    objToPush.idNotifity = idMsg;
    objToPush.innerObjs.push(obj);

    NotifityManager.recipients.push(objToPush);
};
NotifityManager.send = function(idMsg,idTarget){
    if (null == idTarget){

        // ONLY FOR TESTING
        if (NeeedDisplayUpdate==idMsg)
            Render.get().fullClear();

        for (var i = 0; i< NotifityManager.recipients.length;++i){
            if(NotifityManager.recipients[i].idNotifity == idMsg) {
                for (var j = 0; j < NotifityManager.recipients[i].innerObjs.length;++j){
                    // if ( NotifityManager.recipients[i].innerObjs[j].getID()== idTarget)
                    NotifityManager.recipients[i].innerObjs[j]._notifity (idMsg);  //  ???
                }
            }
        }
    }
    else {
        for (var i2 = 0; i2 < NotifityManager.recipients.length;++i2){
            if(NotifityManager.recipients[i2].idNotifity == idMsg) {
                for (var j2 = 0; j2 < NotifityManager.recipients[i2].innerObjs.length;++j2){
                   // if (NotifityManager.recipients[i2].innerObjs[j2].getID()== idTarget)
                   //     NotifityManager.recipients[i2].innerObjs[j2]._notifity (idMsg);  //  ???

                    // ONLY FOR TESTING
                    if (NotifityManager.recipients[i2].innerObjs[j2].getID()== idTarget ||
                        NotifityManager.recipients[i2].innerObjs[j2].getID()== 'debuger.object' )
                        NotifityManager.recipients[i2].innerObjs[j2]._notifity (idMsg);  //  ???
                }
            }
        }
    }
};
NotifityManager.unbind=function(obj){
    for (var i = 0; i< NotifityManager.recipients.length;++i){

        var arr     =   NotifityManager.recipients[i].innerObjs;
        var length  =   arr.length;

        for (var j = 0; j < arr.length;++j)
            if (arr[j]==obj){
                arr.splice(j,1);
                j--;
                length =   arr.length;
            }
    }
};
//----------------------------------------------------------------------------------------------------------------------
NotifityManager();

var Notifity = function(){
    var objf = null;
    var self = null;

    var focusObj = null;
};
Notifity.bind = function(objf,obj){
    Notifity.objf = objf;
    Notifity.self = obj;
};
Notifity.action = function (){
    if (Notifity.objf != undefined)
        Notifity.objf (self);
};
Notifity.bindFocusObj = function (obj){
    Notifity.focusObj = obj;
};
Notifity.killFocus = function (){
    if (Notifity.focusObj)
        Notifity.focusObj.killFocus ();
};

//----------------------------------------------------------------------------------------------------------------------

Responder = function(){
   
};
