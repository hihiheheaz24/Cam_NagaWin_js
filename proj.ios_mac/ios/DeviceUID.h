//
//  DeviceUID.h
//
//  Created by LEX on 1/29/16.
//
//

#ifndef DeviceUID_h
#define DeviceUID_h

#import <Foundation/Foundation.h>

@interface DeviceUID : NSObject

@property(nonatomic, strong, readonly) NSString *uidKey;
@property(nonatomic, strong, readonly) NSString *uid;

+ (NSString *)uid;

@end

#endif /* DeviceUID_h */
