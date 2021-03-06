var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useImperativeHandle } from 'react';
import { SafeAreaView, Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
var MonoConnect = function (props, ref) {
    var publicKey = props.publicKey, onClose = props.onClose, onSuccess = props.onSuccess;
    var _a = React.useState(false), openWidget = _a[0], setOpenWidget = _a[1];
    var _b = React.useState(null), code = _b[0], setCode = _b[1];
    var connect_url = React.useMemo(function () {
        var base = "https://connect.withmono.com/?";
        var qs = { key: publicKey, code: code };
        Object.keys(qs).map(function (k) {
            if (qs[k]) {
                base = base.concat(k + "=" + qs[k] + "&");
            }
        });
        return base.slice(0, -1);
    }, [code, publicKey]);
    useImperativeHandle(ref, function () { return ({
        openWidget: function () {
            setCode(null);
            setOpenWidget(true);
        },
        reauthorise: function (reauth_code) {
            setCode(reauth_code);
            setOpenWidget(true);
        },
    }); });
    function handleMessage(message) {
        var response = JSON.parse(message);
        switch (response.type) {
            case "mono.connect.widget.account_linked":
                var data_1 = response.data;
                onSuccess(__assign(__assign({}, data_1), { getAuthCode: function () { return data_1.code; } }));
                setOpenWidget(false);
                break;
            case "mono.connect.widget.closed":
                setOpenWidget(false);
                onClose();
                break;
        }
    }
    function RenderError(_a) {
        var name = _a.name;
        return (<View style={styles.errorScreen}>
        <Text style={styles.errorMessage}>
          {name}: Something went wrong. Try again.
        </Text>
        <View style={{ marginTop: 5 }}>
          <TouchableOpacity style={styles.btn} onPress={function () { return setOpenWidget(false); }}>
              <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>);
    }
    var INJECTED_JAVASCRIPT = "window.MonoClientInterface = window.ReactNativeWebView;";
    return (<Modal visible={openWidget} animationType="slide" transparent={false}>
      <SafeAreaView style={[{ flex: 1, backgroundColor: "rgba(0,0,0, 0.6)" }]}>
        <WebView style={{ flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} injectedJavaScript={INJECTED_JAVASCRIPT} source={{ uri: connect_url }} onMessage={function (e) { return handleMessage(e.nativeEvent.data); }} startInLoadingState={true} renderLoading={function () { return <View style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", height: "100%" }}><ActivityIndicator size="small" color="#182CD1"/></View>; }} renderError={function (e) { return <RenderError name={e}/>; }}/>
      </SafeAreaView>
    </Modal>);
};
var styles = StyleSheet.create({
    btn: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: "#E4E7EB",
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    errorScreen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
        backgroundColor: "white"
    },
    errorMessage: {
        color: 'red',
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20
    }
});
export default React.forwardRef(MonoConnect);
