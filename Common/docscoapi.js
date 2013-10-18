(function (global) {
    'use strict';
	
	var asc        = window["Asc"];
	var asc_user  = asc.asc_CUser;

	// Класс надстройка, для online и offline работы
	var CDocsCoApi = function (options) {
		this._CoAuthoringApi = new DocsCoApi();
		this._onlineWork = false;

		if (options)
		{
			this.onAuthParticipantsChanged = options.onAuthParticipantsChanged;
			this.onParticipantsChanged = options.onParticipantsChanged;
			this.onMessage = options.onMessage;
			this.onLocksAcquired = options.onLocksAcquired;
			this.onLocksReleased = options.onLocksReleased;
			this.onLocksReleasedEnd = options.onLocksReleasedEnd; // ToDo переделать на массив release locks
			this.onDisconnect = options.onDisconnect;
			this.onFirstLoadChanges = options.onFirstLoadChanges;
			this.onConnectionStateChanged = options.onConnectionStateChanged;
			this.onSetIndexUser = options.onSetIndexUser;
			this.onSaveChanges = options.onSaveChanges;
			this.onStartCoAuthoring = options.onStartCoAuthoring;
		}
	};

	CDocsCoApi.prototype.init = function (user, docid, token, serverHost, serverPath, callback, editorType) {
		if (this._CoAuthoringApi && this._CoAuthoringApi.isRightURL()) {
			var t = this;
			this._CoAuthoringApi.onAuthParticipantsChanged = function (e) {t.callback_OnAuthParticipantsChanged(e);};
			this._CoAuthoringApi.onParticipantsChanged = function (e, Count) {t.callback_OnParticipantsChanged(e, Count);};
			this._CoAuthoringApi.onMessage = function (e) {t.callback_OnMessage(e);};
			this._CoAuthoringApi.onLocksAcquired = function (e) {t.callback_OnLocksAcquired(e);};
			this._CoAuthoringApi.onLocksReleased = function (e, bChanges) {t.callback_OnLocksReleased(e, bChanges);};
			this._CoAuthoringApi.onLocksReleasedEnd = function () {t.callback_OnLocksReleasedEnd();};
			this._CoAuthoringApi.onDisconnect = function (e, isDisconnectAtAll, isCloseCoAuthoring) {t.callback_OnDisconnect(e, isDisconnectAtAll, isCloseCoAuthoring);};
			this._CoAuthoringApi.onFirstLoadChanges = function (e) {t.callback_OnFirstLoadChanges(e);};
			this._CoAuthoringApi.onConnectionStateChanged = function (e) {t.callback_OnConnectionStateChanged(e);};
			this._CoAuthoringApi.onSetIndexUser = function (e) {t.callback_OnSetIndexUser(e);};
			this._CoAuthoringApi.onSaveChanges = function (e) {t.callback_OnSaveChanges(e);};
			// Callback есть пользователей больше 1
			this._CoAuthoringApi.onStartCoAuthoring = function (e) {t.callback_OnStartCoAuthoring(e);};

			this._CoAuthoringApi.init(user, docid, token, serverHost, serverPath, callback, editorType);
			this._onlineWork = true;
		}
		else {
			// Фиктивные вызовы
			this.callback_OnSetIndexUser ("123");
			this.callback_OnFirstLoadChanges ([]);
		}
	};

	CDocsCoApi.prototype.set_url = function (url) {
		if (this._CoAuthoringApi)
			this._CoAuthoringApi.set_url(url);
	};

	CDocsCoApi.prototype.get_state = function () {
		if (this._CoAuthoringApi)
			return this._CoAuthoringApi.get_state();

		return 0;
	};
	
	CDocsCoApi.prototype.getMessages = function () {
		if (this._CoAuthoringApi && this._onlineWork)
			this._CoAuthoringApi.getMessages();
	};

	CDocsCoApi.prototype.sendMessage = function (message) {
		if (this._CoAuthoringApi && this._onlineWork)
			this._CoAuthoringApi.sendMessage(message);
	};

	CDocsCoApi.prototype.askLock = function (arrayBlockId, callback) {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.askLock(arrayBlockId, callback);
		}
		else {
			var t = this;
			window.setTimeout(function () {
					if (callback && _.isFunction(callback)) {
						var lengthArray = (arrayBlockId) ? arrayBlockId.length : 0;
						if (0 < lengthArray) {
							callback({"lock": arrayBlockId[0]});
							// Фиктивные вызовы
							for (var i = 0; i < lengthArray; ++i) {
								t.callback_OnLocksAcquired ({"state" : 2, "block": arrayBlockId[i]});
							}
						}
					}
			}, 1);
		}
	};
	
	CDocsCoApi.prototype.askSaveChanges = function (callback) {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.askSaveChanges(callback);
		} else {
			window.setTimeout(function () {
				if (callback && _.isFunction(callback)) {
					// Фиктивные вызовы
					callback({"savelock": false});
				}
			}, 100);
		}
	};
	
	CDocsCoApi.prototype.unSaveChanges = function () {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.unSaveChanges();
		}
	};

	CDocsCoApi.prototype.saveChanges = function (arrayChanges) {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.saveChanges(arrayChanges);
		}
	};
	
	CDocsCoApi.prototype.getUsers = function () {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.getUsers();
		}
	};

	CDocsCoApi.prototype.releaseLocks = function (blockId) {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.releaseLocks(blockId);
		}
	};
	
	CDocsCoApi.prototype.disconnect = function () {
		if (this._CoAuthoringApi && this._onlineWork) {
			this._CoAuthoringApi.disconnect();
		}
	};

	CDocsCoApi.prototype.callback_OnAuthParticipantsChanged = function (e) {
		if (this.onAuthParticipantsChanged)
			return this.onAuthParticipantsChanged(e);
	};

	CDocsCoApi.prototype.callback_OnParticipantsChanged = function (e, Count) {
		if (this.onParticipantsChanged)
			return this.onParticipantsChanged (e, Count);
	};

	CDocsCoApi.prototype.callback_OnMessage = function (e) {
		if (this.onMessage)
			return this.onMessage (e);
	};

	CDocsCoApi.prototype.callback_OnLocksAcquired = function (e) {
		if (this.onLocksAcquired)
			return this.onLocksAcquired (e);
	};

	CDocsCoApi.prototype.callback_OnLocksReleased = function (e, bChanges) {
		if (this.onLocksReleased)
			return this.onLocksReleased (e, bChanges);
	};

	CDocsCoApi.prototype.callback_OnLocksReleasedEnd = function () {
		if (this.onLocksReleasedEnd)
			return this.onLocksReleasedEnd ();
	};

	/**
	 * Event об отсоединении от сервера
	 * @param {jQuery} e  event об отсоединении с причиной
	 * @param {Bool} isDisconnectAtAll  окончательно ли отсоединяемся(true) или будем пробовать сделать reconnect(false) + сами отключились
	 * @param {Bool} isCloseCoAuthoring
	 */
	CDocsCoApi.prototype.callback_OnDisconnect = function (e, isDisconnectAtAll, isCloseCoAuthoring) {
		if (this.onDisconnect)
			return this.onDisconnect (e, isDisconnectAtAll, isCloseCoAuthoring);
	};

	CDocsCoApi.prototype.callback_OnFirstLoadChanges = function (e) {
		if (this.onFirstLoadChanges)
			return this.onFirstLoadChanges (e);
	};

	CDocsCoApi.prototype.callback_OnConnectionStateChanged = function (e) {
		if (this.onConnectionStateChanged)
			return this.onConnectionStateChanged (e);
	};

	CDocsCoApi.prototype.callback_OnSetIndexUser = function (e) {
		if (this.onSetIndexUser)
			return this.onSetIndexUser (e);
	};

	CDocsCoApi.prototype.callback_OnSaveChanges = function (e) {
		if (this.onSaveChanges)
			return this.onSaveChanges (e);
	};
	CDocsCoApi.prototype.callback_OnStartCoAuthoring = function (e) {
		if (this.onStartCoAuthoring)
			return this.onStartCoAuthoring (e);
	};

    /** States
	 * -1 - reconnect state
     *  0 - not initialized
     *  1 - waiting session id
     *  2 - authorized
	 *  3 - closed
     */
    var DocsCoApi = function (options) {
		if (options)
		{
			this.onAuthParticipantsChanged = options.onAuthParticipantsChanged;
			this.onParticipantsChanged = options.onParticipantsChanged;
			this.onMessage = options.onMessage;
			this.onLocksAcquired = options.onLocksAcquired;
			this.onLocksReleased = options.onLocksReleased;
			this.onLocksReleasedEnd = options.onLocksReleasedEnd; // ToDo переделать на массив release locks
			this.onRelockFailed = options.onRelockFailed;
			this.onDisconnect = options.onDisconnect;
			this.onConnect = options.onConnect;
			this.onFirstLoadChanges = options.onFirstLoadChanges;
			this.onConnectionStateChanged = options.onConnectionStateChanged;
		}
        this._state = 0;
        this._participants = [];
        this._user = "Anonymous";
        this._locks = {};
        this._msgBuffer = [];
        this._lockCallbacks = {};
		this._saveLock = false;
		this._saveCallback = [];
        this._id = "";
		this._indexuser = -1;
		// Если пользователей больше 1, то совместно редактируем
		this.isCoAuthoring = false;
		// Мы сами отключились от совместного редактирования
		this.isCloseCoAuthoring = false;
		
		// Максимальное число изменений, посылаемое на сервер (не может быть нечетным, т.к. пересчет обоих индексов должен быть)
		this.maxCountSaveChanges = 20000;
		// Текущий индекс для колличества изменений
		this.currentIndex = 0;
		// Массив изменений
		this.arrayChanges = null;
		
		this._url = "";
    };
	
	DocsCoApi.prototype.isRightURL = function () {
        return ("" != this._url);
    };

	DocsCoApi.prototype.set_url = function (url) {
		this._url = url;
	};
	
	DocsCoApi.prototype.get_state = function () {
        return this._state;
    };
	
	DocsCoApi.prototype.get_indexUser = function () {
        return this._indexuser;
    };

    DocsCoApi.prototype.getSessionId = function () {
        return this._id;
    };
	// ToDo убрать getParticipants
    DocsCoApi.prototype.getParticipants = function () {
        return this._participants;
    };

    DocsCoApi.prototype.getUser = function () {
        return this._user;
    };

    DocsCoApi.prototype.getLocks = function () {
        return this._locks;
    };

    DocsCoApi.prototype.askLock = function (arrayBlockId, callback) {
		// ask all elements in array
		var i = 0;
		var lengthArray = (arrayBlockId) ? arrayBlockId.length : 0;
		var isLock = false;
		var idLockInArray = null;
		for (; i < lengthArray; ++i) {
			idLockInArray = (this._isExcel) ? arrayBlockId[i].guid : (this._isPresentation) ? arrayBlockId[i]["guid"] : arrayBlockId[i];
			if (this._locks[idLockInArray] && 0 !== this._locks[idLockInArray].state) {
				isLock = true;
				break;
			}
		}
		if (0 === lengthArray)
			isLock = true;

		idLockInArray = (this._isExcel) ? arrayBlockId[0].guid : (this._isPresentation) ? arrayBlockId[0]["guid"] : arrayBlockId[0];

		if (!isLock) {
			//Ask
            this._locks[idLockInArray] = {"state": 1};//1-asked for block
            if (callback && _.isFunction(callback)) {
                this._lockCallbacks[idLockInArray] = callback;
                var lockCalbacks = this._lockCallbacks;

                //Set reconnectTimeout
                window.setTimeout(function () {
                    if (lockCalbacks.hasOwnProperty(idLockInArray)) {
                        //Not signaled already
                        callback({error: "Timed out"});
                        delete lockCalbacks[idLockInArray];
                    }
                }, 5000);//5 sec to signal lock failure
            }
			if (this._isExcel)
				this._send({"type": "getlockrange", "block": arrayBlockId});
			else if (this._isPresentation)
				this._send({"type": "getlockpresentation", "block": arrayBlockId});
			else
            	this._send({"type": "getlock", "block": arrayBlockId});
		} else {
			// Вернем ошибку, т.к. залочены элементы
			window.setTimeout(function () {
				if (callback && _.isFunction(callback)) {
					callback({error: idLockInArray + "-lock"});
				}
			}, 100);
		}
    };
	
	DocsCoApi.prototype.askSaveChanges = function (callback) {
		if (this._saveCallback[this._saveCallback.length - 1]) {
			// Мы еще не отработали старый callback и ждем ответа
			return;
		}
		// Проверим состояние, если мы не подсоединились, то сразу отправим ошибку
		if (-1 === this.get_state()) {
			window.setTimeout(function () {
				if (callback && _.isFunction(callback)) {
					// Фиктивные вызовы
					callback({error: "No connection"});
				}
			}, 100);
			return;
		}
		if (callback && _.isFunction(callback)) {
			var t = this;
			var indexCallback = this._saveCallback.length;
			this._saveCallback[indexCallback] = callback;
				
			//Set reconnectTimeout
			window.setTimeout(function () {
				if (t._saveCallback[indexCallback]) {
					//Not signaled already
					t._saveCallback[indexCallback]({error: "Timed out"});
					t._saveCallback[indexCallback] = null;
				}
			}, 5000);//5 sec to signal lock failure
		}
		this._send({"type": "issavelock"});
	};
	
	DocsCoApi.prototype.unSaveChanges = function () {
		this._send({"type": "unsavelock"});
	};

    DocsCoApi.prototype.releaseLocks = function (blockId) {
        if (this._locks[blockId] && 2 === this._locks[blockId].state /*lock is ours*/) {
            //Ask
            this._locks[blockId] = {"state": 0};//0-released
        }
    };
	
	DocsCoApi.prototype.saveChanges = function (arrayChanges, currentIndex) {
		if (undefined === currentIndex) {
			this.currentIndex = 0;
			this.arrayChanges = arrayChanges;
		} else {
			this.currentIndex = currentIndex;
		}
		var startIndex = this.currentIndex * this.maxCountSaveChanges;
		var endIndex = Math.min(this.maxCountSaveChanges * (this.currentIndex + 1), arrayChanges.length);
		if (endIndex === arrayChanges.length) {
			for (var key in this._locks) {
				if (2 === this._locks[key].state /*lock is ours*/)
					delete this._locks[key];
			}
		}

		this._send({"type": "savechanges", "changes": JSON.stringify(arrayChanges.slice(startIndex, endIndex)),
			"endSaveChanges": (endIndex == arrayChanges.length), "isExcel": this._isExcel});
	};

    DocsCoApi.prototype.getUsers = function () {
        this._send({"type": "getusers"});
    };

    DocsCoApi.prototype.disconnect = function () {
		// Отключаемся сами
		this.isCloseCoAuthoring = true;
        return this.sockjs.close();
    };

    DocsCoApi.prototype.getMessages = function () {
        this._send({"type": "getmessages"});
    };

    DocsCoApi.prototype.sendMessage = function (message) {
        if (typeof message === 'string') {
            this._send({"type": "message", "message": message});
        }
    };

    DocsCoApi.prototype._sendPrebuffered = function () {
        for (var i = 0; i < this._msgBuffer.length; i++) {
            this._send(this._msgBuffer[i]);
        }
        this._msgBuffer = [];
    };

    DocsCoApi.prototype._send = function (data) {
        if (data !== null && typeof data === "object") {
            if (this._state > 0) {
                this.sockjs.send(JSON.stringify(data));
            }
            else {
                this._msgBuffer.push(data);
            }
        }
    };

    DocsCoApi.prototype._onMessages = function (data) {
        if (data["messages"] && this.onMessage) {
            this.onMessage(data["messages"]);
        }
    };

    DocsCoApi.prototype._onGetLock = function (data) {
        if (data["locks"]) {
            for (var key in data["locks"]) {
                if (data["locks"].hasOwnProperty(key)) {
                    var lock = data["locks"][key],
						blockTmp = (this._isExcel) ? lock["block"]["guid"] : (this._isPresentation) ? lock["block"]["guid"] : key,
						blockValue = (this._isExcel) ? lock["block"] : (this._isPresentation) ? lock["block"] : key;
                    if (lock !== null) {
                        var changed = true;
                        if (this._locks[blockTmp] && 1 !== this._locks[blockTmp].state /*asked for it*/) {
                            //Exists
                            //Check lock state
                            changed = !(this._locks[blockTmp].state === (lock["sessionId"] === this._id ? 2 : 3) &&
                                this._locks[blockTmp]["user"] === lock["user"] &&
                                this._locks[blockTmp]["time"] === lock["time"] &&
                                this._locks[blockTmp]["block"] === blockTmp);
                        }

                        if (changed) {
                            this._locks[blockTmp] = {"state":lock["sessionId"] === this._id ? 2 : 3, "user":lock["user"], "time":lock["time"], "block": blockTmp, "blockValue": blockValue};//2-acquired by me!
                        }
                        if (this._lockCallbacks.hasOwnProperty(blockTmp) &&
                            this._lockCallbacks[blockTmp] !== null &&
                            _.isFunction(this._lockCallbacks[blockTmp])) {
                            if (lock["sessionId"] === this._id) {
                                //Do call back
                                this._lockCallbacks[blockTmp]({"lock":this._locks[blockTmp]});
                            }
                            else {
                                this._lockCallbacks[blockTmp]({"error":"Already locked by " + lock["user"]});
                            }
                            delete this._lockCallbacks[blockTmp];
                        }
                        if (this.onLocksAcquired && changed) {
                            this.onLocksAcquired(this._locks[blockTmp]);
                        }
                    }
                }
            }
        }
    };

    DocsCoApi.prototype._onReleaseLock = function (data) {
        if (data["locks"]) {
			var bSendEnd = false;
            for (var block in data["locks"]) {
                if (data["locks"].hasOwnProperty(block)) {
                    var lock = data["locks"][block],
						blockTmp = (this._isExcel) ? lock["block"]["guid"] : (this._isPresentation) ? lock["block"]["guid"] : lock["block"];
                    if (lock !== null) {
                        this._locks[blockTmp] = {"state":0, "user":lock["user"], "time":lock["time"], "changes":lock["changes"], "block":lock["block"]};
                        if (this.onLocksReleased) {
							// false - user not save changes
                            this.onLocksReleased(this._locks[blockTmp], false);
							bSendEnd = true;
                        }
                    }
                }
            }
			if (bSendEnd && this.onLocksReleasedEnd)
				this.onLocksReleasedEnd();
        }
    };
	
	DocsCoApi.prototype._onSaveChanges = function (data) {
        if (data["locks"]) {
			var bSendEnd = false;
            for (var block in data["locks"]) {
                if (data["locks"].hasOwnProperty(block)) {
                    var lock = data["locks"][block],
						blockTmp = (this._isExcel) ? lock["block"]["guid"] : (this._isPresentation) ? lock["block"]["guid"] : lock["block"];
                    if (lock !== null) {
                        this._locks[blockTmp] = {"state":0, "user":lock["user"], "time":lock["time"], "changes":lock["changes"], "block":lock["block"]};
                        if (this.onLocksReleased) {
							// true - lock with save
                            this.onLocksReleased(this._locks[blockTmp], true);
							bSendEnd = true;
                        }
                    }
                }
            }
			if (bSendEnd && this.onLocksReleasedEnd)
				this.onLocksReleasedEnd();
        }
		if (data["changes"]) {
			if (this.onSaveChanges) {
				this.onSaveChanges(JSON.parse(data["changes"]));
			}
		}
    };
	
	DocsCoApi.prototype._onStartCoAuthoring = function (isStartEvent) {
		if (false === this.isCoAuthoring) {
			this.isCoAuthoring = true;
			if (this.onStartCoAuthoring) {
				this.onStartCoAuthoring(isStartEvent);
			}
		}
	};
	
	DocsCoApi.prototype._onSaveLock = function (data) {
		if (undefined != data["savelock"] && null != data["savelock"]) {
			var indexCallback = this._saveCallback.length - 1;
			if (this._saveCallback[indexCallback]) {
				this._saveCallback[indexCallback] (data);
				this._saveCallback[indexCallback] = null;
			}
		}
	};
	
	DocsCoApi.prototype._onUnSaveLock = function (data) {
		this._saveLock = false;
		if (this.onUnSaveLock)
			this.onUnSaveLock ();
	};

    DocsCoApi.prototype._onFirstLoadChanges = function (data) {
		var t = this;
		var allServerChanges = data["changes"];
        if (allServerChanges && this.onFirstLoadChanges) {
			var allChanges = [];
			for (var changeId in allServerChanges) {
				var change = allServerChanges[changeId];
				var changesOneUser = change["changes"];
				if (changesOneUser) {
					changesOneUser = JSON.parse(changesOneUser);
					for (var i in changesOneUser)
						allChanges.push(changesOneUser[i]);
				}
			}
			
			if (0 < allChanges.length) {
				// Функция может быть долгой (и в IE10 происходит disconnect). Поэтому вызовем через timeout
				window.setTimeout(function () {
					t.onFirstLoadChanges(allChanges);
				}, 10);
			}
        }
    };
	
	DocsCoApi.prototype._onSetIndexUser = function (data) {
		if (data && this.onSetIndexUser) {
			this.onSetIndexUser (data);
		}
	};
	
	DocsCoApi.prototype._onSavePartChanges = function () {
		this.saveChanges (this.arrayChanges, this.currentIndex + 1);
	};

    DocsCoApi.prototype._onPreviousLocks = function (locks, previousLocks) {
        var i=0;
        if (locks && previousLocks) {
            for (var block in locks) {
                if (locks.hasOwnProperty(block)) {
                    var lock = locks[block];
                    if (lock !== null && lock["block"]) {
                        //Find in previous
                        for (i=0; i < previousLocks.length; i++) {
                            if (previousLocks[i] === lock["block"] && lock["sessionId"] === this._id) {
                                //Lock is ours
                                previousLocks.remove(i);
                                break;
                            }
                        }
                    }
                }
            }
            if (previousLocks.length>0 && this.onRelockFailed)  {
                this.onRelockFailed(previousLocks);
            }
            previousLocks=[];
        }
    };
	
	DocsCoApi.prototype._onParticipantsChanged = function (participants, isStartEvent) {
		this._participants = [];
		if (participants) {
			var tmpUser, countEditUsers = 1;
			for (var i = 0; i < participants.length; ++i) {
				tmpUser = new asc_user ();
				tmpUser.asc_setId (participants[i]["id"]);
				tmpUser.asc_setUserName (participants[i]["username"]);
				this._participants.push (tmpUser);
				// Считаем число всех пользователей (и тех кто просматривает тоже)
				++countEditUsers;
			}
			
			if (isStartEvent) {
				if (this.onAuthParticipantsChanged)
					this.onAuthParticipantsChanged (this._participants);
			}
			else {
				if (this.onParticipantsChanged)
					this.onParticipantsChanged (this._participants, countEditUsers);
			}
			
			// Посылаем эвент о совместном редактировании
			if (1 < countEditUsers) {
				this._onStartCoAuthoring(isStartEvent);
			}
		}
	};

	DocsCoApi.prototype._onConnectionStateChanged = function (data) {
		var userStateChanged = null;
		if (undefined !== data["state"] && this.onConnectionStateChanged) {
			userStateChanged = new asc_user();
			userStateChanged.asc_setId(data["id"]);
			userStateChanged.asc_setUserName(data["username"]);
			userStateChanged.asc_setState(data["state"]);
			this.onConnectionStateChanged(userStateChanged);
		}
	};

    var reconnectTimeout, attemptCount=0;

    function initSocksJs(url,docsCoApi)  {
        var sockjs = new SockJS(url, null, {debug: true});

        sockjs.onopen = function () {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                attemptCount = 0;
            }
            docsCoApi._state = 1; // Opened state
            if (docsCoApi.onConnect) {
                docsCoApi.onConnect();
            }
            if (docsCoApi._locks)
            {
                docsCoApi.ownedLockBlocks = [];
                //If we already have locks
                for (var block in docsCoApi._locks) {
                    if (docsCoApi._locks.hasOwnProperty(block)) {
                        var lock = docsCoApi._locks[block];
                        if (lock["state"] === 2) {
                            //Our lock.
                            docsCoApi.ownedLockBlocks.push(lock["block"]);
                        }
                    }
                }
                docsCoApi._locks = {};
            }
            docsCoApi._send(
                {
                    "type":"auth",
                    "docid":docsCoApi._docid,
                    "token":docsCoApi._token,
                    "user":docsCoApi._user.asc_getId(),
					"username":docsCoApi._user.asc_getUserName(),
                    "locks":docsCoApi.ownedLockBlocks,
                    "sessionId":docsCoApi._id,
					"serverHost": docsCoApi._serverHost,
					"serverPath": docsCoApi._serverPath
                });

        };

        sockjs.onmessage = function (e) {
            //TODO: add checks and error handling
            //Get data type
            var dataObject = JSON.parse(e.data);
            var type = dataObject.type;
            docsCoApi.dataHandler[type](dataObject);
        };
        sockjs.onclose = function (evt) {
			docsCoApi._state = -1; // Reconnect state
			var bIsDisconnectAtAll = attemptCount >= 20 || docsCoApi.isCloseCoAuthoring;
			if (bIsDisconnectAtAll)
				docsCoApi._state = 3; // Closed state
			if (docsCoApi.onDisconnect) {
                docsCoApi.onDisconnect(evt.reason, bIsDisconnectAtAll, docsCoApi.isCloseCoAuthoring);
            }
			if (docsCoApi.isCloseCoAuthoring)
				return;
            //Try reconect
            if (attemptCount < 20) {
                tryReconnect();
            }
        };


        function tryReconnect() {
            if (reconnectTimeout)
            {
                clearTimeout(reconnectTimeout);
            }
            attemptCount++;
            reconnectTimeout = setTimeout(function(){
                delete docsCoApi.sockjs;
                docsCoApi.sockjs = initSocksJs(url,docsCoApi);
            },500*attemptCount);

        }

        return sockjs;
    }


    DocsCoApi.prototype.init = function (user, docid, token, serverHost, serverPath, callback, editorType) {
        this._user = user;
        this._docid = docid;
        this._token = token;
        this._initCallback = callback;
        this.ownedLockBlocks=[];
        //Begin send auth
        var docsCoApi = this;
		// Server info
		this._serverHost = serverHost;
		this._serverPath = serverPath;
		this.sockjs_url = this._url + '/doc/'+docid+'/c';
        this.sockjs = initSocksJs(this.sockjs_url, this);
		this._isExcel = c_oEditorId.Speadsheet === editorType;
		this._isPresentation = c_oEditorId.Presentation === editorType;
		this._isAuth = false;

        this.dataHandler =
        {
            "auth":function (data) {
				if (true === docsCoApi._isAuth) {
					// Мы уже авторизовывались, это просто reconnect
					return;
				}
                if (data["result"] === 1) {
					// Выставляем флаг, что мы уже авторизовывались
					docsCoApi._isAuth = true;

                    //TODO: add checks
                    docsCoApi._state = 2; // Authorized
                    docsCoApi._id = data["sessionId"];
					
					docsCoApi._onParticipantsChanged(data["participants"], /*isStartEvent*/ true);
					
					if (data["indexuser"]) {
						docsCoApi._indexuser = data["indexuser"];
						docsCoApi._onSetIndexUser (docsCoApi._indexuser);
					}
					
                    if (data["messages"] && docsCoApi.onMessage) {
                        docsCoApi._onMessages(data);
                    }
                    if (data["locks"]) {
                        if (docsCoApi.ownedLockBlocks && docsCoApi.ownedLockBlocks.length>0) {
                            docsCoApi._onPreviousLocks(data["locks"],docsCoApi.ownedLockBlocks);
                        }
                        docsCoApi._onGetLock(data);
                    }
                    if (data["changes"]) {
                        docsCoApi._onFirstLoadChanges(data);
                    } else if (docsCoApi.onFirstLoadChanges) {
						// Нужно послать фиктивное завершение (эта функция означает что мы соединились)
						docsCoApi.onFirstLoadChanges([]);
					}

                    //Send prebuffered
                    docsCoApi._sendPrebuffered();
                }
                //TODO: Add errors
                if (docsCoApi._initCallback)
                {
                    docsCoApi._initCallback({result:data["result"]});
                }
            },
			"getusers":function (data) {
				// Специально для возможности получения после прохождения авторизации
				docsCoApi._onParticipantsChanged(data["participants"], /*isStartEvent*/ true);
			},
            "participants":function (data) {
                //Pushed participants list from server
				docsCoApi._onParticipantsChanged(data["participants"], /*isStartEvent*/ false);
            },
            "message":function (data) {
                docsCoApi._onMessages(data);
            },
            "getlock":function (data) {
                docsCoApi._onGetLock(data);
            },
            "releaselock":function (data) {
                docsCoApi._onReleaseLock(data);
            },
			"connectstate":function (data) {
				docsCoApi._onConnectionStateChanged(data);
			},
            "savechanges":function (data) {
                docsCoApi._onSaveChanges(data);
            },
			"savelock":function (data) {
				docsCoApi._onSaveLock(data);
			},
			"unsavelock":function (data) {
				docsCoApi._onUnSaveLock(data);
			},
			"savePartChanges":function () {
				docsCoApi._onSavePartChanges();
			}
        };
    };
    global["CDocsCoApi"] = CDocsCoApi;

    //Helpers
    /*Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };*/

})(this);

