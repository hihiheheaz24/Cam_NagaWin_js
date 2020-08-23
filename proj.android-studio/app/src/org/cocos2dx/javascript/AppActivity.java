/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;
import android.Manifest;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.Sharer;
import com.facebook.share.model.ShareHashtag;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.model.SharePhoto;
import com.facebook.share.model.SharePhotoContent;
import com.facebook.share.widget.ShareDialog;
import com.google.android.gms.ads.identifier.AdvertisingIdClient;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.iid.InstanceID;
import com.onesignal.OSNotificationAction;
import com.onesignal.OSNotificationOpenResult;
import com.onesignal.OneSignal;

import org.cocos2dx.javascript.iap.InAppHelper;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import cyt.kh.naga.club.R;

//import com.google.android.gms.iid.InstanceID;

public class AppActivity extends Cocos2dxActivity {
    private CallbackManager mCallbackManager;
    private static InAppHelper inAppHelper;
    private String one_playerid;
    private String one_tokenid;
    private static String android_AdId;
    private String deviceId;
    private static Cocos2dxActivity sCocos2dxActivity;
    private static String url_webview_new;
    private static ImageView sSplashBgImageView = null;

    //--------->>>>>>>> all onesignal <<<<<-----------------------
    private String userName;

    class ExampleNotificationOpenedHandler implements OneSignal.NotificationOpenedHandler {
        @Override
        public void notificationOpened(OSNotificationOpenResult result) {
            try {
                OSNotificationAction.ActionType actionType = result.action.type;
                JSONObject data = result.notification.payload.additionalData;

                Log.v("====>OpenOnesignal", "OpenOnesignal === " + String.valueOf(data));
//                JSONArray jsonArr = data.getJSONArray("params");
//                if (data != null) {
//                    if(!data.optString("giftcode").isEmpty()){
//                        save_ins.androidCallC(117, data.optString("giftcode"));
//                        Log.v("=====>OpenOneSignal", "giftcode: " + data.optString("giftcode"));
//                    }else if(!data.optString("freechip").isEmpty()){
//                        save_ins.androidCallC(118, data.optString("freechip"));
//                        Log.v("=====>OpenOneSignal", "freechip: " + data.optString("freechip"));
//                    }
//                }
                if (actionType == OSNotificationAction.ActionType.ActionTaken)
                    Log.v("OneSignalExample", "Button pressed with id: " + result.action.actionID);
            }catch (Exception e){
                Log.v("Exception", "===>Error notificationOpened");
                e.printStackTrace();
            }
        }
    }
    private static void showSplash() {
        sSplashBgImageView = new ImageView(sCocos2dxActivity);
        sSplashBgImageView.setImageResource(R.drawable.bg_screen_loading1);
        sSplashBgImageView.setScaleType(ImageView.ScaleType.FIT_XY);
        sCocos2dxActivity.addContentView(sSplashBgImageView,
                new WindowManager.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                )
        );
    }
    public static void hideSplash() {
        sCocos2dxActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (sSplashBgImageView != null) {
                    sSplashBgImageView.setVisibility(View.GONE);
                }
            }
        });
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
      // setTheme(R.style.MyAppTheme);
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        sCocos2dxActivity = this;
        showSplash();
        this.setKeepScreenOn(true);
        mCallbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        save_ins.sendToJavascript(LOGIN_FACEBOOK, loginResult.getAccessToken().getToken());
                        //guiw accesstoken sang js
                    }

                    @Override
                    public void onCancel() {
                        // App code
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        // App code
                    }
                });
        SDKWrapper.getInstance().init(this);
        save_ins = this;

        inAppHelper = new InAppHelper(save_ins);
        inAppHelper.onCreate();

        //*********************One Signal ********************************************************
        OneSignal.startInit(this)
                .inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification)
                .setNotificationOpenedHandler(new ExampleNotificationOpenedHandler())
                .autoPromptLocation(true)
                .disableGmsMissingPrompt(true)
                .unsubscribeWhenNotificationsAreDisabled(true)
                .init();

//        OSPermissionSubscriptionState varTemp = OneSignal.getPermissionSubscriptionState();
        Log.v(TAG, "************* ONESIGNAL  *********** " + OneSignal.VERSION);
        OneSignal.idsAvailable(new OneSignal.IdsAvailableHandler() {
            @Override
            public void idsAvailable(String userId, String registrationId) {
                try {
                    Log.v(TAG, "=======>idsAvailable Exception");
                    Log.v(TAG, "************* ONESIGNAL  ***********: " + registrationId);
                    Log.v(TAG, "************* ONESIGNAL  ***********: " + userId);
                    one_playerid = userId;
                    one_tokenid = registrationId;
                }catch (Exception e){
                    Log.v(TAG, "=======>idsAvailable Exception");
                    e.printStackTrace();
                }
            }
        });
        Log.v(TAG, "************* END ONESIGNAL  ***********");
        //*********************END One Signal ********************************************************

      //  save_ins.registerReceiver();
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

      //  save_ins.registerReceiver();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
   //     unregisterReceiver(networkChangeReceiver);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
        if(inAppHelper != null) {
            inAppHelper.onDestroy();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        if (requestCode != FRAMEWORK_REQUEST_CODE) {
            mCallbackManager.onActivityResult(requestCode, resultCode, data);
            if (inAppHelper != null) {
                inAppHelper.onActivityResult(requestCode, resultCode, data);
            }
            return;
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();

       new Thread(new Runnable() {
           public void run()
           {
               try
               {
                   Context ctx = AppActivity.this.getApplicationContext();
                   AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(ctx);
                   android_AdId = adInfo.getId();
                   Log.v("getAndroidGGAID", "result androidAdId try: " + android_AdId);
               }
               catch (Exception e)
               {
                   android_AdId = "";
                   Log.v("getAndroidGGAID", "result androidAdId catch: " + e.toString());
               }

           }
       }).start();
    }

    /**/
    private static final int FRAMEWORK_REQUEST_CODE = 1;
    private int nextPermissionsRequestCode = 4000;
    private final Map<Integer, OnCompleteListener> permissionsListeners = new HashMap<>();
    public static AppActivity save_ins;
    public String androidId = "";
    public static String TAG = "cocos2djs";

    private static final String GET_ANDROID_ID  = "1";
    private static final String GET_BUNDLE_ID  = "2";
    private static final String GET_VERSION_ID  = "3";
    private static final String LOGIN_FACEBOOK  = "4";
    private static final String GET_PATH_FOR_SCREENSHOT  = "5";
    private static final String VEYRY_PHONE  = "6";
    private static final String CHAT_ADMIN  = "7";
    private static final String DEVICE_VERSION  = "8";
    private static final String SHARE_FACEBOOK  = "9";
    private static final String LOG_EVENT_TRACKING = "10";
    private static final String BUYIAP  = "11";
    private static final String SHARE_CODE_MESSAGE  = "12";
    private static final String SEND_TAG_ONESIGNAL  = "13";
    private static final String OPEN_FANPAGE  = "14";
    private static final String OPEN_GROUP  = "15";
    private static final String CHECK_NETWORK  = "16";
    private static final String PUSH_NOTI_OFFLINE  = "17";
    private static final String CHECK1SIM  = "20";
    private static final String CHECK2SIM  = "21";
    private static final String HIDESPLASH  = "22";
    private static final String GET_INFO_DEVICE_SML  = "23";
    private static final String CALL_PHONE  = "24";
    private static final String WEB_VIEW  = "25";
    private static final String CLOSE_WEB_VIEW  = "26";
    private static final String ON_VIBRATOR  = "35";
    public static void onCallFromJavascript(final String evt, final String params) throws JSONException, UnsupportedEncodingException {
        Log.v("JAVASCRIPT_2_ANDROID", "---onCallFromJavascript === EVT " + evt + " Data: " + params);

//        showAlertDialog("HELLO " + evt, params);
        switch (evt){
            case GET_ANDROID_ID:{
                // save_ins.getAndroidId();
                save_ins.sendToJavascript(GET_ANDROID_ID, getIID(save_ins));
                break;
            }
            case GET_BUNDLE_ID:{
                save_ins.getBundleId();
                break;
            }
            case GET_VERSION_ID:{
                save_ins.getVersionId();
                break;
            }
            case LOGIN_FACEBOOK:{
                save_ins.onLoginFacebook();
                break;
            }case VEYRY_PHONE:{

                break;
            }case CHAT_ADMIN:{
                JSONObject jsonData = new JSONObject(params);

                Log.i("<cocos> page ID ", "page Id " + jsonData.getString("pageID"));
                save_ins.openMessageFacebook(jsonData.getString("pageID"));
                break;
            }
            case DEVICE_VERSION:{
                save_ins.getDeviceVersion();
                break;
            }
            case GET_PATH_FOR_SCREENSHOT:{
                Log.i("duy", "pathhh");
                save_ins.getPahtForScreenShot();
                break;
            } case SHARE_FACEBOOK:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.shareFB(jsonData.getString("path"),jsonData.getString("hasTag"));
                break;
            }
            case LOG_EVENT_TRACKING:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.sendLogEvent(jsonData.getJSONArray("param"));
                break;
            }
            case SHARE_CODE_MESSAGE:{
                save_ins.shareCodeMessage(params);
                break;
            }
            case BUYIAP:{
                if(inAppHelper != null) {
                    inAppHelper.buyItem(params);
                }
                break;
            }
            case SEND_TAG_ONESIGNAL:{
                JSONObject jsonData = new JSONObject(params);
//                Log.v("Log Android", "====> jsonData: " + jsonData);

                String key = (String) jsonData.get("key");
                String value = (String) jsonData.get("value");
                Log.v("Log Android", "====> key: " + key + "  value: " + value);
                OneSignal.sendTag(key, value);
                break;
            }
            case OPEN_FANPAGE:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.openFanpage(jsonData.getString("pageID"),jsonData.getString("pageUrl"));
                break;
            }
            case OPEN_GROUP:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.openGroup(jsonData.getString("groupID"),jsonData.getString("groupUrl"));
                break;
            }

//            case CHECK_NETWORK:{
//                save_ins.checkNetwork();
//                break;
//            }
            case PUSH_NOTI_OFFLINE:{
               // Log.i("Cocos Call Native:", "Push Noti OffLine: " + params);
                JSONObject jsonData = new JSONObject(params);
                String title = jsonData.getString("title");

                String base64 = jsonData.getString("content");
                byte[] data = Base64.decode(base64, Base64.DEFAULT);
                String content = new String(data, "UTF-8");
                Log.d("js" , "chuoi nhan dc la== " + content );

                String category = jsonData.getString("category");
                String identifier = jsonData.getString("identifier");
                int time = Integer.parseInt(jsonData.getString("time"));
                boolean isLoop =Boolean.parseBoolean(jsonData.getString("isLoop"));
                save_ins.pushNotiOffline(title, content, category, identifier, time,isLoop);
                break;
            }
            // case CHECK1SIM:{
            //     save_ins.sendToJavascript(CHECK1SIM, check1simallmang());
            //     break;
            // }
            // case CHECK2SIM:{
            //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
            //         Log.d("TEST", "check 2 sim lolipop");
            //         save_ins.sendToJavascript(CHECK2SIM, check2simallmang());


            //     } else {
            //         Log.d("TEST", "check 1 sim kitkat");
            //         save_ins.checkForPhoneStatePermission(1);
            //         save_ins.sendToJavascript(CHECK1SIM, check1simallmang());

            //     }
            //     break;
            // }
            case HIDESPLASH:{
                save_ins.hideSplash();
                break;
            }
             case GET_INFO_DEVICE_SML:{
                save_ins.getInfoDeviceSML();
                break;
            }
            case CALL_PHONE:{
                save_ins.callPhone(params);
                break;
            }
            case WEB_VIEW:{
                save_ins.url_webview_new = params;
                save_ins.callOpenWebView();
                break;
            }
            case ON_VIBRATOR:{
                save_ins.onVibrator();
                break;
            }
        }
    }

    public void onVibrator(){
        save_ins.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    //deprecated in API 26
                    v.vibrate(200);
                }
            }
        });
    }

    public static void sendToJavascript(final String evt, final String params){
        Log.i("duy", "params: " + params);

        save_ins.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                // Cocos2dxJavascriptJavaBridge.evalString("cc.NGWlog('--------->>>>>>>>JavaCall evt: " + evt + "  params:  " + params + " ');");
                Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS(\"" + evt + "\",\"" + params + "\")");
            }
        });
    }

    public static void sendToJavascriptBitch(final String evt, final String params){
        Log.i("iaplogggg", "iaploggggparams: " + params);

        save_ins.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                // Cocos2dxJavascriptJavaBridge.evalString("cc.NGWlog('--------->>>>>>>>JavaCall evt: " + evt + "  params:  " + params + " ');");
                Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS(\"" + evt + "\",\'" + params + "\')");
            }
        });
    }


//    private static void getAndroidGGAID(final Context ctx) {
//        new Thread(new Runnable() {
//            public void run()
//            {
//                try
//                {
//                    AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(ctx);
//                    android_AdId = adInfo.getId();
//                    Log.v("getAndroidGGAID", "result androidAdId try: " + android_AdId);
//                }
//                catch (Exception e)
//                {
//                    android_AdId = "";
//                    Log.v("getAndroidGGAID", "result androidAdId catch: " + e.toString());
//                }
//
//            }
//        }).start();
//    }

    public static String getIID(final Context context) {
//        getAndroidGGAID(context);

        String android_ins_Id = "";
        try {
            android_ins_Id = InstanceID.getInstance(context).getId();
        } catch (Exception ex) {
            android_ins_Id = "";
        }

        if (!TextUtils.isEmpty(android_AdId)) {
            Log.v("getAndroidGGAID", "result android_AdId : " + android_AdId);
            save_ins.deviceId = android_AdId;
            return android_AdId;
        } else if (!TextUtils.isEmpty(android_ins_Id)) {
            Log.v("getAndroidGGAID", "result android_ins_Id : " + android_ins_Id);
            save_ins.deviceId = android_ins_Id;
            return android_ins_Id;
        } else {
            save_ins.deviceId = "";
            return "";
        }
    }

    public static String getAndroidId() {
        String myDeviceId = "cannot_get_deviceid";
        save_ins.androidId = myDeviceId;
        // get android id
        try {
            String android_id = Settings.Secure.getString(save_ins.getContext().getContentResolver(),
                    Settings.Secure.ANDROID_ID);

            Log.v(TAG, "************* ANDROID ID ***********" + android_id);
            myDeviceId = android_id;
            save_ins.androidId = myDeviceId;
            save_ins.sendToJavascript(GET_ANDROID_ID, save_ins.androidId);
        } catch (Exception e) {
            System.out.println("ERROR IN GET ANDROID ID: " + e.getMessage());
        }
        return myDeviceId;
    }
    public  String getBundleId() {
        String myBundleId = "cannot_get_bundleId";
        myBundleId =  getApplicationContext().getPackageName();
        save_ins.sendToJavascript(GET_BUNDLE_ID, myBundleId);
        return myBundleId;
    }
    public  void getVersionId() {
        String packageName = save_ins.getPackageName();
        PackageInfo pInfo;
        String version;
        try {
            pInfo = save_ins.getPackageManager().getPackageInfo(packageName, 0);
            version = pInfo.versionName;
            System.out.println("Version : " + version);
            save_ins.sendToJavascript(GET_VERSION_ID, version);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
//        String VersionId = "cannot_get_VersionId";
//        VersionId=  BuildConfig.VERSION_NAME;
//        save_ins.sendToJavascript(GET_VERSION_ID, VersionId);
//        return VersionId;
    }
    public  String getDeviceVersion() {
        String DeviceVersion = "cannot_get_VersionId";
        DeviceVersion = Build.VERSION.RELEASE;
        save_ins.sendToJavascript(DEVICE_VERSION, DeviceVersion);
        return DeviceVersion;
    }

    public void onLoginFacebook(){
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        boolean isLoggedIn = accessToken != null && !accessToken.isExpired();
        if(isLoggedIn){
            //gui sang javascript

            save_ins.sendToJavascript(LOGIN_FACEBOOK, accessToken.getToken());
        }else{
            LoginManager.getInstance().logInWithReadPermissions(this, Arrays.asList("public_profile"));
        }
    }


    public boolean appInstalledOrNot(String uri) {
        PackageManager pm = getPackageManager();
        try {
            pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }


    public void openMessageFacebook(String pageID) {
        try {
            boolean isExistFacebookApp = save_ins.appInstalledOrNot("com.facebook.orca");
            if (isExistFacebookApp) {
                String ppp = "fb-messenger://user-thread/" + pageID;
                Log.d("dcm", "0000debug mo app fb  " + ppp);
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(ppp));
                save_ins.startActivity(intent);
            } else {
                Log.d("dcm", "1111debug mo brrrr fb");
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(
                        "https://play.google.com/store/apps/details?id=com.facebook.orca"));
                intent.setPackage("com.android.vending");
                save_ins.startActivity(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private interface OnCompleteListener {
        void onComplete();
    }

    private boolean canReadSmsWithoutPermission() {
        final GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int googlePlayServicesAvailable = apiAvailability.isGooglePlayServicesAvailable(this);
        if (googlePlayServicesAvailable == ConnectionResult.SUCCESS) {
            return true;
        }
        //TODO we should also check for Android O here t18761104

        return false;
    }
    private boolean isGooglePlayServicesAvailable() {
        final GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int googlePlayServicesAvailable = apiAvailability.isGooglePlayServicesAvailable(this);
        return googlePlayServicesAvailable == ConnectionResult.SUCCESS;
    }
    private void requestPermissions(final String permission, final int rationaleTitleResourceId, final int rationaleMessageResourceId, final AppActivity.OnCompleteListener listener) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            if (listener != null) {
                listener.onComplete();
            }
            return;
        }

        checkRequestPermissions(
                permission,
                rationaleTitleResourceId,
                rationaleMessageResourceId,
                listener);
    }
    @TargetApi(23)
    private void checkRequestPermissions(final String permission, final int rationaleTitleResourceId, final int rationaleMessageResourceId, final AppActivity.OnCompleteListener listener) {
        if (checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED) {
            if (listener != null) {
                listener.onComplete();
            }
            return;
        }

        final int requestCode = nextPermissionsRequestCode++;
        permissionsListeners.put(requestCode, listener);

        if (shouldShowRequestPermissionRationale(permission)) {
            new AlertDialog.Builder(this)
                    .setTitle(rationaleTitleResourceId)
                    .setMessage(rationaleMessageResourceId)
                    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(final DialogInterface dialog, final int which) {
                            requestPermissions(new String[]{permission}, requestCode);
                        }
                    })
                    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(final DialogInterface dialog, final int which) {
                            // ignore and clean up the listener
                            permissionsListeners.remove(requestCode);
                        }
                    })
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .show();
        } else {
            requestPermissions(new String[]{permission}, requestCode);
        }
    }
    public void getPahtForScreenShot(){
        Log.i("duy", "getPahtForScreenShot");

        String currenttime = "";
        Calendar calander = Calendar.getInstance();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
        currenttime = simpleDateFormat.format(calander.getTime());

        String path= getExternalFilesDir(null).getAbsolutePath() + File.separator+currenttime+".png"; //success!!
        Log.v("android show", "path get ="+path);
        save_ins.sendToJavascript(GET_PATH_FOR_SCREENSHOT, path);

    }

    public  void shareFB(String imgPath, String hasTag) {
        String shareHasTag= hasTag;
        boolean isFbAppInstalled = save_ins.appInstalledOrNot("com.facebook.katana");
        if (!isFbAppInstalled) {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(
                    "https://play.google.com/store/apps/details?id=com.facebook.katana"));
            intent.setPackage("com.android.vending");
            save_ins.startActivity(intent);
        } else {
            File file = new File(imgPath);
            if (file.exists()) {
                Log.v("android show", "path dmmmm file exists");
            }
            if (!file.exists()) {
                Log.v("android show", "path dmmmm file not exists! Need to create file!");
            }
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;
            Bitmap bMap = BitmapFactory.decodeFile(imgPath, options);
            ShareDialog shareDialog = new ShareDialog(save_ins);
            Log.v("android show", "path call share screenshot: can share 2" + imgPath);
            shareDialog.registerCallback(mCallbackManager, new FacebookCallback<Sharer.Result>() {
                @Override
                public void onSuccess(Sharer.Result result) {
                    Log.v("android show", "call share screenshot: share success");
                    save_ins.sendToJavascript(SHARE_FACEBOOK,"1");
                }

                @Override
                public void onCancel() {
                    Log.v("android show", "call share screenshot: cancel");
                    save_ins.sendToJavascript(SHARE_FACEBOOK, "0");
                }

                @Override
                public void onError(FacebookException e) {
                    Log.v("android show", "call share screenshot: share error: " + e.getMessage());
                   save_ins.sendToJavascript(SHARE_FACEBOOK, "0");
                }
            });
            if (ShareDialog.canShow(ShareLinkContent.class)) {
                Log.v("android show", "path call share screenshot: can share 3");
                SharePhoto photo = new SharePhoto.Builder()
                        .setBitmap(bMap).build();
                SharePhotoContent content = new SharePhotoContent.Builder()
                        .addPhoto(photo)
                        .setShareHashtag(new ShareHashtag.Builder()
                                .setHashtag(shareHasTag)
                                .build())
                        .build();

                shareDialog.show(content);
            }

        }
    }
    public  void shareCodeMessage(String code) {
        Intent smsIntent = new Intent(Intent.ACTION_VIEW);
        smsIntent.setType("vnd.android-dir/mms-sms");
        smsIntent.putExtra("sms_body", code);
        startActivity(smsIntent);
    }

    public static void sendLogEvent(final JSONArray jsonArr) {
        try {
            AppEventsLogger logger = AppEventsLogger.newLogger(save_ins);

            String event = jsonArr.getString(0);
            Bundle parameters = new Bundle();
            parameters.putString(event, event);
            Log.d("js", "----> " + event);

            int si = jsonArr.length();
            if (si >= 2) {
                String strTemp = "";
                strTemp = jsonArr.getString(si - 1);

                String[] strArray = strTemp.split(",");

                for (int i = 1; i < si - 1; i++) {
                    parameters.putString(strArray[i - 1], jsonArr.getString(i));
                }
            }
            logger.logEvent(event, parameters);

//            save_ins.mFirebaseAnalytics.logEvent(event, parameters);
            Log.d("js", "===============Firebase" + parameters.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    public void openFanpage(String pageID, String pageURL) {
        try {
            boolean isExistFacebookApp = save_ins.appInstalledOrNot("com.facebook.katana");
            if (isExistFacebookApp) {
                Log.d("js", "0000debug mo app fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("fb://page/" + pageID));
                save_ins.startActivity(intent);
            } else {
                Log.d("js", "1111debug mo brrrr fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(pageURL));
                save_ins.startActivity(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void openGroup(String groupID, String groupURL) {
        try {
            boolean isExistFacebookApp = save_ins.appInstalledOrNot("com.facebook.katana");
            if (isExistFacebookApp) {
                Log.d("js", "0000debug mo app fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("fb://group/" + groupID));
                save_ins.startActivity(intent);
            } else {
                Log.d("js", "1111debug mo brrrr fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(groupURL));
                save_ins.startActivity(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private BroadcastReceiver networkChangeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d("app","Network connectivity change");
          //  save_ins.checkNetwork();
        }
    };

//    public void registerReceiver(){
//        IntentFilter intentFilter = new IntentFilter();
//        intentFilter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
//        registerReceiver(networkChangeReceiver, intentFilter);
//    }

    public void checkNetwork(){
//        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
//        NetworkInfo Info = cm.getActiveNetworkInfo();
//
//        if (Info == null || !Info.isConnectedOrConnecting()) {
//            Log.i(TAG, "No connection");
//            showToast("Not Connection. Please check Setting connection again!");
//
//           // save_ins.sendToJavascript(CHECK_NETWORK, "-1");
//        } else {
//            int netType = Info.getType();
////            int netSubtype = Info.getSubtype();
//
//            if (netType == ConnectivityManager.TYPE_WIFI) {
//                Log.i(TAG, "Wifi connection");
//                WifiManager wifiManager = (WifiManager) save_ins.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
//
//                int rssi = wifiManager.getConnectionInfo().getRssi();
//                int level = WifiManager.calculateSignalLevel(rssi, 5);
//                Log.i(TAG,"-->Wifi connection Level is " + level + " out of 5");
//                if(level < 3){
//                    showToast("Low network");
//                    save_ins.sendToJavascript(CHECK_NETWORK, "0");
//                    return;
//                }
//            } else if (netType == ConnectivityManager.TYPE_MOBILE) {
//                Log.i(TAG, "GPRS/3G connection");
//            }
//
//            if(isInternetAvailable()){
//                Log.i(TAG, "Has internet");
//            }else{
//                Log.i(TAG, "Not internet");
//                showToast("No internet connection, please check 3G/wifi connection again!");
//                save_ins.sendToJavascript(CHECK_NETWORK, "-1");
//            }
//        }
    }
//    boolean isInternetAvailable() {
//        try {
//            String command = "ping -c 1 google.com";
//            return (Runtime.getRuntime().exec(command).waitFor() == 0);
//        } catch (Exception e) {
//            return false;
//        }
//    }

    void showToast(final String msg){
        save_ins.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(save_ins.getApplicationContext(), msg, Toast.LENGTH_LONG).show();
            }
        });
    }
    public void pushNotiOffline(String title, String content, String category, String identifier, int time,boolean isLoop ) {
            Log.v(TAG, "0000==============> " + title + " MSG   " + content + " TIME " + String.valueOf(time));
            if (content.isEmpty() || content == "") return;
        if(title == ""){
            title = String.valueOf(R.string.app_name);
        }
        if(!isLoop){
            Log.v(TAG, "pushNotiOffline  isLoop = false" );
            NotificationHelper.scheduleRepeatingRTCNotification(save_ins, title, content, category, identifier, time);
            NotificationHelper.enableBootReceiver(save_ins);
       }else{
            Log.v(TAG, "pushNotiOffline  isLoop = true" );
           NotificationHelper.scheduleRepeatingNotificationEveryDay(save_ins, title, content, category, identifier, time);
            NotificationHelper.enableBootReceiver(save_ins);
        }

    }

    public void removeAllHandleNoti() {
        try {
            Log.v("Log Android", "===> vao ham huy");
            NotificationHelper.cancelAlarmElapsed();
//            NotificationHelper.disableBootReceiver(save_ins);
            NotificationHelper.cancelAlarmEveryDay();
            NotificationHelper.cancelAlarmRTC();
            NotificationHelper.disableBootReceiver(save_ins);
        } catch (Exception e) {
            Log.v("Log Android", "====>Exception removeAllHandleNoti");
            e.printStackTrace();
        }
    }

    private void checkForPhoneStatePermission(int typeCheck) {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            // 6.0

            if (typeCheck == 1) { // state, location

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                    // SDK xin roi
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.READ_PHONE_STATE}, REQUEST_PHONE_STATE_CODE);
                } else {
                    //... Permission has already been granted, obtain the UUID
//                    getDeviceUuId();
                }

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PHONE_LOCATION_CODE);
                }

            } else if (typeCheck == 2) { // contact

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.GET_ACCOUNTS) != PackageManager.PERMISSION_GRANTED) {
                    // SDK xin roi
//					ActivityCompat.requestPermissions(save_ins, new String[]{android.Manifest.permission.GET_ACCOUNTS}, REQUEST_PHONE_GET_ACC_CODE);
                }

            } else if (typeCheck == 3) { // SMS

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.READ_SMS}, REQUEST_PHONE_READ_SMS_CODE);
                }
                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.RECEIVE_SMS) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.RECEIVE_SMS}, REQUEST_PHONE_RECEIVE_SMS_CODE);
                }
                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.SEND_SMS}, REQUEST_PHONE_SEND_SMS_CODE);
                }


            } else if (typeCheck == 4) { // camera

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.CAMERA}, REQUEST_PHONE_CAMERA_CODE);
                }

            } else if (typeCheck == 5) { // storage

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, REQUEST_PHONE_READ_FILE_CODE);
                }

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    // SDK xin roi
//					ActivityCompat.requestPermissions(save_ins, new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_PHONE_WRITE_FILE_CODE);
                }

            }
        } else {
//            getDeviceUuId();
        }
    }
  public void getInfoDeviceSML() {
        Log.d("ANDROID CC","getInfoDeviceSML!!!!");

        String langu = Locale.getDefault().getDisplayLanguage();
        String mod = Build.MODEL;
        PackageInfo pInfo = null;
        String versionNam = "unknow";
        String versionOs = Build.VERSION.SDK_INT + "";
        String brand = Build.BRAND;
        try {
            pInfo = save_ins.getPackageManager().getPackageInfo(save_ins.getPackageName(), 0);
            versionNam = pInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        try {
            JSONObject tempJsonObj = new JSONObject();
            tempJsonObj.put("language", langu);
            tempJsonObj.put("model", mod);
            tempJsonObj.put("vername", versionNam);
            tempJsonObj.put("veros", versionOs);
            tempJsonObj.put("brand", brand);
           // String strJsonBody = tempJsonObj.toString();
            String strJsonBody = langu+","+mod+","+versionNam+","+versionOs+","+brand+",";
            Log.v("Android", "====>11 gui cho JS: " + strJsonBody);
            save_ins.sendToJavascript(GET_INFO_DEVICE_SML, strJsonBody);
        } catch (JSONException e) {
            e.printStackTrace();
        }


    }
    public void callPhone(String phoneNumber){
        try {
            Log.e("cocos", "Vao ham goi roi " + phoneNumber);
            if(ContextCompat.checkSelfPermission(save_ins, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
                Intent callIntent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:"+phoneNumber));
                save_ins.startActivity(callIntent);
//                    Intent intent = new Intent(Intent.ACTION_DIAL);
//                    intent.setData(Uri.parse(number));
//                    save_ins.startActivity(intent);
            }

            Log.e("cocos", "Vao ham goi roi 222222" + phoneNumber);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }
    }
    public void callOpenWebView() {
        save_ins.runOnUiThread(new Runnable() {
            public void run() {
                final Dialog dialog = new Dialog(save_ins, android.R.style.Theme_Translucent_NoTitleBar);
                dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
                dialog.setContentView(R.layout.activity_main);

                ImageButton dialogButton = (ImageButton) dialog.findViewById(R.id.btn_close);
                dialogButton.setOnClickListener(
                        new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                dialog.dismiss();
                                save_ins.sendToJavascript(CLOSE_WEB_VIEW,null);
                                Log.d("CLOSE WEB VIEW","BO MAY CLOSE WEB VIEW");
                            }
                        });

                WebView webView = (WebView) dialog.findViewById(R.id.webview);
                WebSettings webSettings = webView.getSettings();
                webSettings.setJavaScriptEnabled(true);
                webSettings.setDomStorageEnabled(true);

                webView.loadUrl(save_ins.url_webview_new);

                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        return false;
                    }
                });

                dialog.show();
                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
                dialog.getWindow().getAttributes().gravity = Gravity.CENTER;
            }
        });

    }
    private static final int REQUEST_PHONE_STATE_CODE = 2171;
    private static final int REQUEST_PHONE_GET_ACC_CODE = 2172;
    private static final int REQUEST_PHONE_READ_SMS_CODE = 2173;
    private static final int REQUEST_PHONE_SEND_SMS_CODE = 2174;
    private static final int REQUEST_PHONE_RECEIVE_SMS_CODE = 2175;
    private static final int REQUEST_PHONE_CAMERA_CODE = 2176;
    private static final int REQUEST_PHONE_LOCATION_CODE = 2177;
    private static final int REQUEST_PHONE_READ_FILE_CODE = 2178;
    private static final int REQUEST_PHONE_WRITE_FILE_CODE = 2179;
}
