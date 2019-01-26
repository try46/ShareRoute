/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
let app = {

    // represents the device capability of launching ARchitect Worlds with specific features
    // 特定の機能を備えたARchitect Worldを起動するためのデバイス機能を表します。
    isDeviceSupported: false,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 起動時に必要なすべてのイベントをバインドします。 一般的なイベントは以下のとおりです。
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
    },
    // --- Wikitude Plugin ---
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    // この方法を使用して、ローカルファイルシステムまたはリモートサーバーから特定のARchitect Worldをロードします。
    loadARchitectWorld: function(example, poi) {
      
      localStorage.setItem("arpoi", poi); // localStorateに値のセット
        // check if the current device is able to launch ARchitect Worlds
        // 現在のデバイスがARchitect Worldsを起動できるか確認します
        app.wikitudePlugin.isDeviceSupported(function() {
            app.wikitudePlugin.setOnUrlInvokeCallback(app.onUrlInvoke);

            app.wikitudePlugin.loadARchitectWorld(function successFn(loadedURL) {
                /* Respond to successful world loading if you need to */
            }, function errorFn(error) {
                alert('Loading AR web view failed: ' + error);
            },
            example.path, example.requiredFeatures, example.startupConfiguration
            );
        }, function(errorMessage) {
            alert(errorMessage);
        },
        example.requiredFeatures
        );
    },
    // This function gets called if you call "document.location = architectsdk://" in your ARchitect World
    // この関数は、あなたのARchitect Worldで "document.location = architectsdk：//"を呼び出すと呼び出されます。
    onUrlInvoke: function (url) {
        if (url.indexOf('captureScreen') > -1) {
            app.wikitudePlugin.captureScreen(
                function(absoluteFilePath) {
                    alert("snapshot stored at:\n" + absoluteFilePath);
                },
                function (errorMessage) {
                    alert(errorMessage);
                },
                true, null
            );
        } else {
            alert(url + "not handled");
        }
    }
    // --- End Wikitude Plugin ---
};

app.initialize();
