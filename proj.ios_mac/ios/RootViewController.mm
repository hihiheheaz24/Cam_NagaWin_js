/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
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

#import "RootViewController.h"
#import "cocos2d.h"
#import "platform/ios/CCEAGLView-ios.h"

#import <AccountKit/AKFAccountKit.h>
#import <AccountKit/AKFSkinManager.h>
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#import <AccountKit/AKFAccountKit.h>


@interface RootViewController () <AKFViewControllerDelegate>
@end

@implementation RootViewController {
    AKFAccountKit *_accountKit;
    NSString *_authorizationCode;
    UIViewController<AKFViewController> *_pendingLoginViewController;
    BOOL _showAccountOnAppear;
}

/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Initialize the CCEAGLView
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [UIScreen mainScreen].bounds
                                         pixelFormat: (__bridge NSString *)cocos2d::GLViewImpl::_pixelFormat
                                         depthFormat: cocos2d::GLViewImpl::_depthFormat
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];

    // Enable or disable multiple touches
    [eaglView setMultipleTouchEnabled:YES];

    // Set EAGLView as view of RootViewController
    self.view = eaglView;
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
    
    if (_accountKit == nil) {
        _accountKit = [[AKFAccountKit alloc] initWithResponseType:AKFResponseTypeAccessToken];
    }
    
    _showAccountOnAppear = (_accountKit.currentAccessToken != nil);
    _pendingLoginViewController = [_accountKit viewControllerForLoginResume];
    
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    if (_showAccountOnAppear) {
        _showAccountOnAppear = NO;
    } else if (_pendingLoginViewController != nil) {
        [self _prepareLoginViewController:_pendingLoginViewController];
        [self presentViewController:_pendingLoginViewController animated:animated completion:NULL];
        _pendingLoginViewController = nil;
    }
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];

    auto glview = cocos2d::Director::getInstance()->getOpenGLView();

    if (glview)
    {
        CCEAGLView *eaglview = (__bridge CCEAGLView *)glview->getEAGLView();

        if (eaglview)
        {
            CGSize s = CGSizeMake([eaglview getWidth], [eaglview getHeight]);
            cocos2d::Application::getInstance()->applicationScreenSizeChanged((int) s.width, (int) s.height);
        }
    }
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

- (void)buyProduct:(NSString *)_productID{
    self.productID = _productID;
    NSLog(@"------>   DMM   %@", self.productID);
    [self getProductInfo];
    
}
- (void)getProductInfo{
    if ([SKPaymentQueue canMakePayments]){
        SKProductsRequest *request = [[SKProductsRequest alloc]
                                      initWithProductIdentifiers:
                                      [NSSet setWithObject:self.productID]];
        request.delegate = self;
        [request start];
    }
    else{
        NSLog(@"Please enable In App Purchase in Settings");
    }
}

#pragma mark -
#pragma mark SKProductsRequestDelegate

-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSArray *products = response.products;
    
    if (products.count != 0)
    {
        _product = products[0];
        
        NSLog(@"------>   DMM productIdentifier  %@", _product.productIdentifier);
        SKPayment *payment = [SKPayment paymentWithProduct:_product];
        [[SKPaymentQueue defaultQueue] addPayment:payment];
    } else {
        NSLog(@"Product not found");
    }
    
    products = response.invalidProductIdentifiers;
    
    for (SKProduct *product in products)
    {
        NSLog(@"Product not found: %@", product);
    }
}

//- (IBAction)buyProduct:(id)sender {
//    SKPayment *payment = [SKPayment paymentWithProduct:_product];
//    [[SKPaymentQueue defaultQueue] addPayment:payment];
//}

-(void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    for (SKPaymentTransaction *transaction in transactions)
    {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchased:{
                [[SKPaymentQueue defaultQueue]
                 finishTransaction:transaction];
                
                NSLog(@"Transaction Success!");
                NSLog(@"-->0  %@", transaction.transactionIdentifier);
                NSData *receiptData;
                if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_7_0) {
                    receiptData = [NSData dataWithContentsOfURL:[[NSBundle mainBundle] appStoreReceiptURL]];
                } else {
                    receiptData = transaction.transactionReceipt;
                }
                
                NSLog(@"-->1  %@", receiptData);
                NSLog(@"-->2  %@", transaction.transactionReceipt);
                NSLog(@"\n\n===== RECEIPT DATA: %@ =====\n\n", [receiptData base64EncodedStringWithOptions:0]);

                //                NSString* thu = [NSString stringWithFormat:@"\"%@\"", receiptData];
                NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"200", [receiptData base64EncodedStringWithOptions:0]];
                se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
                break;
            }
            case SKPaymentTransactionStateFailed:
                NSLog(@"Transaction Failed");
                [[SKPaymentQueue defaultQueue]
                 finishTransaction:transaction];
                break;
                
            default:
                break;
        }
    }
}

- (void) callVerifyPhoneNumber:(NSString*)type {
    UIViewController<AKFViewController> *viewController = [_accountKit viewControllerForPhoneLoginWithPhoneNumber:nil state:nil];
    
    if (viewController != nil) {
        [self _prepareLoginViewController:viewController];
        [self presentViewController:viewController animated:YES completion:NULL];
    }
}

- (void)viewController:(UIViewController<AKFViewController> *)viewController didCompleteLoginWithAccessToken: (id<AKFAccessToken>)accessToken state:(NSString *)state {
    [_accountKit requestAccount:^(id<AKFAccount> accessToken, NSError *error) {
        if ([accessToken phoneNumber] != nil) {
            NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"6", [[accessToken phoneNumber] stringRepresentation]];
            se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
        }
    }];
}

- (void)viewController:(UIViewController<AKFViewController> *)viewController didFailWithError:(NSError *)error
{
    NSLog(@"%@ did fail with error: %@", viewController, error);
}

- (void)_prepareLoginViewController:(UIViewController<AKFViewController> *)loginViewController
{
    loginViewController.delegate = self;
}

- (void)_presentWithSegueIdentifier:(NSString *)segueIdentifier animated:(BOOL)animated
{
    if (animated) {
        [self performSegueWithIdentifier:segueIdentifier sender:nil];
    } else {
        [UIView performWithoutAnimation:^{
            [self performSegueWithIdentifier:segueIdentifier sender:nil];
        }];
    }
}

-(void)shareScreenshotFacebook:(UIImage*)screenshot withHastag:(NSString*)hashTag{
    //    NSLog(@"hashTag: %@", hashTag);
    FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] init];
    photo.image = screenshot;
    photo.userGenerated = YES;
    
    FBSDKSharePhotoContent *content = [[FBSDKSharePhotoContent alloc] init];
    content.photos = @[photo];
    content.hashtag = [FBSDKHashtag hashtagWithString:hashTag];
//    content.hashtag = [FBSDKHashtag hashtagWithString:@"#NGW"];
    
    [FBSDKShareDialog showFromViewController:self
                                 withContent:content
                                    delegate:self];
}

- (void)removePendingLocalNotification
{
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center removeAllPendingNotificationRequests];
}

-(void) showNoti:(NSString*) title withMessage:(NSString*) message withCategory:(NSString*)categoryIdentifier withIdentifier:(NSString*)identifier withTimeSecond : (NSInteger) timeSeconds{
    //    NSLog(@"======> Show notification:  %@", message);
    UNMutableNotificationContent* content = [[UNMutableNotificationContent alloc] init];
    content.title = [NSString localizedUserNotificationStringForKey:title arguments:nil];
    content.body = [NSString localizedUserNotificationStringForKey:message
                                                         arguments:nil];
    content.categoryIdentifier = categoryIdentifier;
    content.sound = [UNNotificationSound defaultSound];
    
    // Deliver the notification in time seconds.
    UNTimeIntervalNotificationTrigger* trigger = [UNTimeIntervalNotificationTrigger
                                                  triggerWithTimeInterval:timeSeconds repeats:NO];
    UNNotificationRequest* request = [UNNotificationRequest requestWithIdentifier:identifier
                                                                          content:content trigger:trigger];
    
    // Schedule the notification.
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    
    //    NSLog(@"======> Show notification:  %@", message);
    [center addNotificationRequest:request withCompletionHandler:^(NSError *_Nullable error){
        if (error != nil) {
            //            NSLog(@"%@", error.localizedDescription);
        }
    }];
}

- (void)sharer:(id<FBSDKSharing>)sharer didCompleteWithResults:(NSDictionary *)results {
    NSLog(@"=-=-=-===== didCompleteWithResults: %@", results);
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"9", @"1"];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

- (void)sharer:(id<FBSDKSharing>)sharer didFailWithError:(NSError *)error {
    NSLog(@"=-=-=-===== didFailWithError: %@", error);
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"9", @"0"];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

- (void)sharerDidCancel:(id<FBSDKSharing>)sharer {
    NSLog(@"=-=-=-===== sharerDidCancel");
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"9", @"0"];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

-(void)onCall:(NSString*) phoneNumber{
    NSString *callNumber = [@"tel://" stringByAppendingString:phoneNumber];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:callNumber]];
}

-(void)openWebView:(NSString*) url_we {
    NSURL *url = [NSURL URLWithString:url_we];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    _webView = [[WKWebView alloc] initWithFrame:CGRectZero];
    [_webView loadRequest:request];
    _webView.frame = CGRectMake(self.view.frame.origin.x, self.view.frame.origin.y + 50, self.view.frame.size.width, self.view.frame.size.height - 50);
    [self.view addSubview:_webView];
    _webView.tag = 69;
//    _webView.multipleTouchEnabled = NO;
    //_webView.scrollView.multipleTouchEnabled = false;
    _webView.scrollView.bouncesZoom=false;
    
    UIImageView *imgView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"bar"]];
    imgView.frame = CGRectMake(self.view.frame.origin.x, -50, self.view.frame.size.width, 50);
    [_webView addSubview:imgView];
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [button addTarget:self
               action:@selector(close:)
     forControlEvents:UIControlEventTouchDown];
    [button setBackgroundImage:[UIImage imageNamed:@"btn_close"] forState:UIControlStateNormal];
    button.frame = CGRectMake(self.view.frame.size.width - 124, 0, 124, 50);
    [button addTarget:self action:@selector(close:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];
    button.tag = 69;
}
- (IBAction)close:(id)sender {
    [[self.view viewWithTag:69] removeFromSuperview];
}
@end
