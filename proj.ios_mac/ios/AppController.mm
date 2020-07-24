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

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "platform/ios/CCEAGLView-ios.h"

#import "cocos-analytics/CAAgent.h"

#import <JavaScriptCore/JavaScriptCore.h>
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#import "Definitions.h"
#include "DeviceUtil.h"
#include "DeviceUID.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import <sys/utsname.h>
#import <Firebase.h>
#import "Reachability.h"

using namespace cocos2d;

@implementation AppController

@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
static AppDelegate* s_sharedApplication = nullptr;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[UIApplication sharedApplication] setIdleTimerDisabled: YES];
    
    [OneSignal initWithLaunchOptions:launchOptions
                               appId:OneSignalAppID
            handleNotificationAction:nil
                            settings:@{kOSSettingsKeyAutoPrompt: @false}];
    OneSignal.inFocusDisplayType = OSNotificationDisplayTypeNotification;
    [OneSignal promptForPushNotificationsWithUserResponse:^(BOOL accepted) {
        NSLog(@"User accepted notifications: %d", accepted);
    }];
    
    [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions];
    
    
    [CAAgent enableDebug:NO];
    
    if (s_sharedApplication == nullptr)
    {
        s_sharedApplication = new (std::nothrow) AppDelegate();
    }
    cocos2d::Application *app = cocos2d::Application::getInstance();
    
    // Initialize the GLView attributes
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();
    
    // Override point for customization after application launch.
    
    // Add the view controller's view to the window and display.
    window = [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]];
    
    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
    _viewController.wantsFullScreenLayout = YES;
    
    
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    
    // IMPORTANT: Setting the GLView should be done after creating the RootViewController
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void *)_viewController.view);
    cocos2d::Director::getInstance()->setOpenGLView(glview);
    
    [FIRApp configure];
    
    //run the cocos2d-x game scene
    app->run();
    
    return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    
    BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                  openURL:url
                                                        sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                               annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                    ];
    // Add any custom logic here.
    return handled;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->pause(); */
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->resume(); */
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
    if (CAAgent.isInited) {
        [CAAgent onPause];
    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    auto glview = (__bridge CCEAGLView*)(Director::getInstance()->getOpenGLView()->getEAGLView());
    auto currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject];
    if (glview == currentView) {
        cocos2d::Application::getInstance()->applicationWillEnterForeground();
    }
    if (CAAgent.isInited) {
        [CAAgent onResume];
    }
}

- (void)applicationWillTerminate:(UIApplication *)application {
    /*
     Called when the application is about to terminate.
     See also applicationDidEnterBackground:.
     */
    if (s_sharedApplication != nullptr)
    {
        delete s_sharedApplication;
        s_sharedApplication = nullptr;
    }
    [CAAgent onDestroy];
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}


#if __has_feature(objc_arc)
#else
- (void)dealloc {
    [window release];
    [_viewController release];
    [super dealloc];
}
#endif

-(void)onCallToNativeJS:(NSString*)evt andParams:(NSString*)params{
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", evt, params];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

+ (void) onCallFromJavaScript:(NSString *) evt andParams:(NSString *)params {
    //    NSLog(@"test call ios: %@ - %@", evt, params);
    if ([evt isEqualToString:GET_DEVICE_ID]) { // device id
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:GET_DEVICE_ID andParams:[DeviceUID uid]];
    }
    else if ([evt isEqualToString:GET_BUNDLE_ID]) { // bundle id
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:GET_BUNDLE_ID andParams:[[NSBundle mainBundle] bundleIdentifier]];
    }
    else if ([evt isEqualToString:GET_VERSION_ID]) { // version
        //        NSString *bundleID = [[NSBundle mainBundle] bundleIdentifier];
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:evt andParams:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
    }
    else if ([evt isEqualToString:LOGIN_FACEBOOK]) { // login face
        //        NSInteger *relogin = [params integerValue];
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController LoginFacebook:0];
    }
    else if ([evt isEqualToString:GET_PATH_FOR_SCREENSHOT]) {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory,
                                                             NSUserDomainMask, YES);
        
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *dataPath =
        [documentsDirectory stringByAppendingPathComponent:@"/Screenshot"];
        if (![[NSFileManager defaultManager] fileExistsAtPath:dataPath])
            [[NSFileManager defaultManager] createDirectoryAtPath:dataPath
                                      withIntermediateDirectories:YES
                                                       attributes:nil
                                                            error:nil];
        
        NSString *filePath =
        [NSString stringWithFormat:@"%@/%@", dataPath, @"screenshot.png"];
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:GET_PATH_FOR_SCREENSHOT andParams:filePath];
    }
    else if ([evt isEqualToString:VERIFY_PHONE]) { // verify
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController.viewController callVerifyPhoneNumber:@"phone"];
    }
    else if ([evt isEqualToString:CHAT_ADMIN]) { // chat admin
    }
    else if ([evt isEqualToString:DEVICE_VERSION]) { // device version
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:DEVICE_VERSION andParams:[[UIDevice currentDevice] systemVersion]];
    }
    else if ([evt isEqualToString:SHARE_FACEBOOK]) { // share image face
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *path = [NSString stringWithFormat:@"%@", [json objectForKey:@"path"]];
        NSString *hasTag = [NSString stringWithFormat:@"%@", [json objectForKey:@"hasTag"]];
        
        UIImage *screenshot = [UIImage imageWithData:[NSData dataWithContentsOfFile:path]];
        AppController* appController = (AppController*)[[UIApplication sharedApplication] delegate];
        [appController.viewController shareScreenshotFacebook:screenshot withHastag:hasTag];
    }
    else if ([evt isEqualToString:LOG_EVENT_TRACKING]) { // tracking
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSArray *arr = [json objectForKey:@"param"];
        
        if([arr count] > 0){
            @try{
                NSUInteger si = [arr count];
                NSString *event = [arr objectAtIndex:0];
                
                //                NSLog(@"=====>event: %@", event);
                if([arr count] > 2){
                    NSMutableDictionary *myMuDic = [[NSMutableDictionary alloc] init];
                    
                    NSString *strTemp = [arr objectAtIndex:si - 1];
                    NSArray *testArray = [[NSArray alloc] init];
                    testArray = [strTemp componentsSeparatedByString:@","];
                    
                    for(int i = 1; i < si - 1; i++){
                        //                        NSLog(@"=====>value: %@  key: %@", [arr objectAtIndex:i], [testArray objectAtIndex:i-1]);
                        [myMuDic setObject:[arr objectAtIndex:i] forKey:[testArray objectAtIndex:i-1]];
                    }
                    
                    [FIRAnalytics logEventWithName:event parameters:myMuDic];
                }
            }@catch(NSException *e){
                //                NSLog(@"Exception sendLogEvent: %@", e);
            }
        }
    }
    else if ([evt isEqualToString:BUY_IAP]) { // iap
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController buyIAP:params];
    }
    else if ([evt isEqualToString:SHARE_CODE_MESSAGE]) { // share code message
        NSString *sms = [NSString stringWithFormat:@"sms:&body=%@", params];
        NSString *url = [sms stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
    }
    else if ([evt isEqualToString:SEND_TAG_ONESIGNAL]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *key = [json objectForKey:@"key"];
        NSString *value = [json objectForKey:@"value"];
        
        //        NSLog(@"send One: \n--> Key: %@\n--> Value: %@", key, value);
        [OneSignal sendTag:key value:value];
    }
    else if ([evt isEqualToString:OPEN_FANPAGE]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *pageId = [json objectForKey:@"pageID"];
        NSString *pageUrl = [json objectForKey:@"pageUrl"];
        
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController openFanpageFB:pageId orOpenWithURL:pageUrl];
    }
    else if ([evt isEqualToString:OPEN_GROUP]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *groupId = [json objectForKey:@"groupID"];
        NSString *groupUrl = [json objectForKey:@"groupUrl"];
        
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController openGroupFB:groupId orOpenWithURL:groupUrl];
    }
    else if ([evt isEqualToString:CHECK_NETWORK]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController checkNetwork];
    }
    else if ([evt isEqualToString:GET_INFO_DEVICE_SML]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController getInfoDeviceSML];
    }
    else if ([evt isEqualToString:CALL_PHONE]) {
           AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
           [appController onCall:params];
       }
    else if ([evt isEqualToString:PUSH_NOTI_OFFLINE]) {
        NSData *data = [params dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSString *title = [json objectForKey:@"title"];
        NSInteger value_time = [[json objectForKey:@"time"] integerValue];
        NSString *content = [json objectForKey:@"content"];
        AppController* appController = (AppController*)[[UIApplication sharedApplication] delegate];
        [appController.viewController showNoti:title
                                   withMessage:content
                                  withCategory:@"null"
                                withIdentifier:@"null"
                                withTimeSecond:value_time+1];
    }
    else if ([evt isEqualToString:CARRIER_NAME]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController getCarrierName];
    }
    else if ([evt isEqualToString:OPEN_WEBVIEW]) {
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController.viewController openWebView:params];
    }
}

- (void)LoginFacebook:(NSInteger)reLogin{
    
    NSString * tokenFB = [FBSDKAccessToken currentAccessToken].tokenString;
    //    NSLog(@"token = %@", tokenFB);
    if (tokenFB == nil || reLogin == 1) {
        NSArray *permissionsArray = @[@"public_profile", @"email"];
        FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
        [login
         logInWithPermissions: permissionsArray
         fromViewController:self.viewController
         handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
             if (error) {
                 NSLog(@"Process error");
             } else if (result.isCancelled) {
                 NSLog(@"Cancelled");
             } else {
                 NSLog(@"Logged in");
                 NSString *a_token = [FBSDKAccessToken currentAccessToken].tokenString;
                 AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
                 [appController onCallToNativeJS:LOGIN_FACEBOOK andParams:a_token];
             }
         }];
    }
    else {
        NSString *a_token = [FBSDKAccessToken currentAccessToken].tokenString;
        AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
        [appController onCallToNativeJS:LOGIN_FACEBOOK andParams:a_token];
    }
    
}

- (void)gameRequestDialog:(nonnull FBSDKGameRequestDialog *)gameRequestDialog didCompleteWithResults:(nonnull NSDictionary<NSString *,id> *)results {
    NSLog(@"=-=-=-===== results: %@ ", results);
}

- (void)gameRequestDialog:(nonnull FBSDKGameRequestDialog *)gameRequestDialog didFailWithError:(nonnull NSError *)error {
    NSLog(@"=-=-=-===== results: %@ ", error);
}

- (void)gameRequestDialogDidCancel:(nonnull FBSDKGameRequestDialog *)gameRequestDialog {
    NSLog(@"=-=-=-===== results: Cancel ");
}

-(void)buyIAP:(NSString*)productID{
    AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
    [appController.viewController buyProduct:productID];
}

-(void)openFanpageFB:(NSString*) fanpageID  orOpenWithURL:(NSString*) fanpageURL{
    NSString *surl = [NSString stringWithFormat:@"%s%@", "fb://profile/", fanpageID];
    NSURL *url = [NSURL URLWithString:surl];
    //    NSLog(@"open app facebook: %@", surl);
    if([[UIApplication sharedApplication] canOpenURL:url]){
        [[UIApplication sharedApplication] openURL:url];
    }else{
        NSURL *linkUrl = [NSURL URLWithString:fanpageURL];
        [[UIApplication sharedApplication] openURL:linkUrl];
    }
}

-(void)openGroupFB:(NSString*) groupID  orOpenWithURL:(NSString*) groupURL{
    [self openFanpageFB:groupID orOpenWithURL:groupURL];
}

-(void)checkNetwork {
    Reachability *myNetwork = [Reachability reachabilityWithHostname:@"google.com"];
    NetworkStatus myStatus = [myNetwork currentReachabilityStatus];
    
    switch (myStatus) {
        case NotReachable:{
            AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
            [appController onCallToNativeJS:CHECK_NETWORK andParams:@"-1"];
            break;
        }
        case ReachableViaWWAN:{
            AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
            [appController onCallToNativeJS:CHECK_NETWORK andParams:@"3G"];
            break;
        }
        case ReachableViaWiFi:{
            AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
            [appController onCallToNativeJS:CHECK_NETWORK andParams:@"Wifi"];
            break;
        }
        default:
            break;
    }
}
- (void) getInfoDeviceSML
{
    struct utsname systemInfo;

    uname(&systemInfo);

    NSString* code = [NSString stringWithCString:systemInfo.machine
                                        encoding:NSUTF8StringEncoding];
    NSLog(@"device code====: %@", code);
    static NSDictionary* deviceNamesByCode = nil;

    if (!deviceNamesByCode) {

        deviceNamesByCode = @{@"i386"      : @"Simulator",
                              @"x86_64"    : @"Simulator",
                              @"iPod1,1"   : @"iPod Touch",        // (Original)
                              @"iPod2,1"   : @"iPod Touch",        // (Second Generation)
                              @"iPod3,1"   : @"iPod Touch",        // (Third Generation)
                              @"iPod4,1"   : @"iPod Touch",        // (Fourth Generation)
                              @"iPod7,1"   : @"iPod Touch",        // (6th Generation)
                              @"iPhone1,1" : @"iPhone",            // (Original)
                              @"iPhone1,2" : @"iPhone",            // (3G)
                              @"iPhone2,1" : @"iPhone",            // (3GS)
                              @"iPad1,1"   : @"iPad",              // (Original)
                              @"iPad2,1"   : @"iPad 2",            //
                              @"iPad3,1"   : @"iPad",              // (3rd Generation)
                              @"iPhone3,1" : @"iPhone 4",          // (GSM)
                              @"iPhone3,3" : @"iPhone 4",          // (CDMA/Verizon/Sprint)
                              @"iPhone4,1" : @"iPhone 4S",         //
                              @"iPhone5,1" : @"iPhone 5",          // (model A1428, AT&T/Canada)
                              @"iPhone5,2" : @"iPhone 5",          // (model A1429, everything else)
                              @"iPad3,4"   : @"iPad",              // (4th Generation)
                              @"iPad2,5"   : @"iPad Mini",         // (Original)
                              @"iPhone5,3" : @"iPhone 5c",         // (model A1456, A1532 | GSM)
                              @"iPhone5,4" : @"iPhone 5c",         // (model A1507, A1516, A1526 (China), A1529 | Global)
                              @"iPhone6,1" : @"iPhone 5s",         // (model A1433, A1533 | GSM)
                              @"iPhone6,2" : @"iPhone 5s",         // (model A1457, A1518, A1528 (China), A1530 | Global)
                              @"iPhone7,1" : @"iPhone 6 Plus",     //
                              @"iPhone7,2" : @"iPhone 6",          //
                              @"iPhone8,1" : @"iPhone 6S",         //
                              @"iPhone8,2" : @"iPhone 6S Plus",    //
                              @"iPhone8,4" : @"iPhone SE",         //
                              @"iPhone9,1" : @"iPhone 7",          //
                              @"iPhone9,3" : @"iPhone 7",          //
                              @"iPhone9,2" : @"iPhone 7 Plus",     //
                              @"iPhone9,4" : @"iPhone 7 Plus",     //
                              @"iPhone10,1": @"iPhone 8",          // CDMA
                              @"iPhone10,4": @"iPhone 8",          // GSM
                              @"iPhone10,2": @"iPhone 8 Plus",     // CDMA
                              @"iPhone10,5": @"iPhone 8 Plus",     // GSM
                              @"iPhone10,3": @"iPhone X",          // CDMA
                              @"iPhone10,6": @"iPhone X",          // GSM
                              @"iPhone11,2": @"iPhone XS",         //
                              @"iPhone11,4": @"iPhone XS Max",     //
                              @"iPhone11,6": @"iPhone XS Max",     // China
                              @"iPhone11,8": @"iPhone XR",         //
                              @"iPhone12,1": @"iPhone 11",         //
                              @"iPhone12,3": @"iPhone 11 Pro",     //
                              @"iPhone12,5": @"iPhone 11 Pro Max", //

                              @"iPad4,1"   : @"iPad Air",          // 5th Generation iPad (iPad Air) - Wifi
                              @"iPad4,2"   : @"iPad Air",          // 5th Generation iPad (iPad Air) - Cellular
                              @"iPad4,4"   : @"iPad Mini",         // (2nd Generation iPad Mini - Wifi)
                              @"iPad4,5"   : @"iPad Mini",         // (2nd Generation iPad Mini - Cellular)
                              @"iPad4,7"   : @"iPad Mini",         // (3rd Generation iPad Mini - Wifi (model A1599))
                              @"iPad6,7"   : @"iPad Pro (12.9\")", // iPad Pro 12.9 inches - (model A1584)
                              @"iPad6,8"   : @"iPad Pro (12.9\")", // iPad Pro 12.9 inches - (model A1652)
                              @"iPad6,3"   : @"iPad Pro (9.7\")",  // iPad Pro 9.7 inches - (model A1673)
                              @"iPad6,4"   : @"iPad Pro (9.7\")"   // iPad Pro 9.7 inches - (models A1674 and A1675)
                              };
    }

    NSString* deviceName = [deviceNamesByCode objectForKey:code];

    if (!deviceName) {
        // Not found on database. At least guess main device type from string contents:

        if ([code rangeOfString:@"iPod"].location != NSNotFound) {
            deviceName = @"iPod Touch";
        }
        else if([code rangeOfString:@"iPad"].location != NSNotFound) {
            deviceName = @"iPad";
        }
        else if([code rangeOfString:@"iPhone"].location != NSNotFound){
            deviceName = @"iPhone";
        }
        else {
            deviceName = @"Unknown";
        }
    }

NSLocale *locale = [NSLocale currentLocale];

NSString *langu = [locale displayNameForKey:NSLocaleIdentifier
                                         value:[locale localeIdentifier]];

NSString *versionOs = [[UIDevice currentDevice] systemVersion];

NSString * versionNam = [[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleShortVersionString"];

//NSString *strInfoSml=langu+","+deviceName+","+versionNam+","+versionOs+","+"Apple"+",";

NSArray *arr=[NSArray arrayWithObjects:langu,deviceName,versionNam,versionOs,@"Apple,",nil];
NSString *strInfoSml =[arr componentsJoinedByString:@","];
NSLog(@"device strInfoSml====: %@", strInfoSml);
AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
 [appController onCallToNativeJS:GET_INFO_DEVICE_SML andParams:strInfoSml];
}
-(void)onCall:(NSString*) phoneNumber {
    NSLog(@"Call Phone ====: %@", phoneNumber);
    NSString *callNumber = [@"tel://" stringByAppendingString:phoneNumber];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:callNumber]];
}
-(void)getCarrierName
{
    CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
    CTCarrier *carrier = [netinfo subscriberCellularProvider];
    
    int countryCode = [carrier.mobileCountryCode intValue];
    int networkCode = [carrier.mobileNetworkCode intValue];
    //    countryCode = 456;
    NSString *strcountryCode =
    [NSString stringWithFormat:@"%d", countryCode];
    
    AppController * appController = (AppController *)[[UIApplication sharedApplication] delegate];
    [appController onCallToNativeJS:CARRIER_NAME andParams:strcountryCode];
    
    
    //    if (countryCode == 456){
    //        return 1;//Cam
    //    }else if (countryCode == 457){
    //        return 2;//Lao
    //    }
    //    return 0;
    
    //    if (countryCode == 520) {
    //        if (networkCode == 1 || networkCode == 3 || networkCode == 23) {
    //            //mb
    //            //            NSLog(@"\n\nAIS");
    //            return 3;
    //        }
    //        else if (networkCode == 5 || networkCode == 18) {
    //            //vn
    //            //            NSLog(@"\n\nDTAC");
    //            return 2;
    //        }
    //        else if (networkCode == 4 || networkCode == 99) {
    //            //vt
    //            //            NSLog(@"\n\nTRUE");
    //            return 1;
    //        }
    //        else
    //        {
    //
    //        }
    //    }
}

@end
