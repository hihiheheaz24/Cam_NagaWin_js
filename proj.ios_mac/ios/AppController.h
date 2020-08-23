/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
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
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <FBSDKShareKit/FBSDKShareKit.h>

#define GET_DEVICE_ID               ([NSString stringWithFormat:@"%s", "1"])
#define GET_BUNDLE_ID               ([NSString stringWithFormat:@"%s", "2"])
#define GET_VERSION_ID              ([NSString stringWithFormat:@"%s", "3"])
#define LOGIN_FACEBOOK              ([NSString stringWithFormat:@"%s", "4"])
#define GET_PATH_FOR_SCREENSHOT     ([NSString stringWithFormat:@"%s", "5"])
#define VERIFY_PHONE                ([NSString stringWithFormat:@"%s", "6"])
#define CHAT_ADMIN                  ([NSString stringWithFormat:@"%s", "7"])
#define DEVICE_VERSION              ([NSString stringWithFormat:@"%s", "8"])
#define SHARE_FACEBOOK              ([NSString stringWithFormat:@"%s", "9"])
#define LOG_EVENT_TRACKING          ([NSString stringWithFormat:@"%s", "10"])
#define BUY_IAP                     ([NSString stringWithFormat:@"%s", "11"])
#define SHARE_CODE_MESSAGE          ([NSString stringWithFormat:@"%s", "12"])
#define SEND_TAG_ONESIGNAL          ([NSString stringWithFormat:@"%s", "13"])
#define OPEN_FANPAGE                ([NSString stringWithFormat:@"%s", "14"])
#define OPEN_GROUP                  ([NSString stringWithFormat:@"%s", "15"])
#define CHECK_NETWORK               ([NSString stringWithFormat:@"%s", "16"])
#define PUSH_NOTI_OFFLINE           ([NSString stringWithFormat:@"%s", "17"])
#define CARRIER_NAME                ([NSString stringWithFormat:@"%s", "19"])
#define GET_INFO_DEVICE_SML         ([NSString stringWithFormat:@"%s", "23"])
#define CALL_PHONE                  ([NSString stringWithFormat:@"%s", "24"])
#define OPEN_WEBVIEW                ([NSString stringWithFormat:@"%s", "25"])



#define OneSignalAppID              ([NSString stringWithFormat:@"%s", "b7d9fbf1-e27a-4b49-9885-b596c8af2bea"])

@class RootViewController;

@interface AppController : NSObject <UIApplicationDelegate, FBSDKGameRequestDialogDelegate>
{
}

@property(nonatomic, readonly) RootViewController* viewController;


+(void)onCallFromJavaScript:(NSString*)evt andParams:(NSString*)params;

-(void)onCallToNativeJS:(NSString*)evt andParams:(NSString*)params;

-(void)LoginFacebook:(NSInteger)reLogin;
-(void)buyIAP:(NSString*)productID;
-(void)openFanpageFB:(NSString*) fanpageID orOpenWithURL:(NSString*) fanpageURL;
-(void)openGroupFB:(NSString*) groupID orOpenWithURL:(NSString*) groupURL;
-(void)checkNetwork;
-(void)getCarrierName;

@end

