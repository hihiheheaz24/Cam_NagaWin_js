package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
//import android.support.v7.app.NotificationCompat;
import android.os.Build;
//import android.support.v4.app.NotificationCompat;
//import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.app.NotificationCompat;
import android.util.Log;


import cyt.kh.naga.club.R;

/**
 * Created by ptyagi on 4/17/17.
 */

/**
 * AlarmReceiver handles the broadcast message and generates Notification
 */
public class AlarmReceiver extends BroadcastReceiver {
//    private final static AtomicInteger c = new AtomicInteger(1000);

    static int ID_1MINH = 0;
    @Override
    public void onReceive(Context context, Intent intent) {
        //Intent to invoke app when click on notification.
        //In this sample, we want to start/launch this sample app when user clicks on notification

        String title = intent.getStringExtra("title");
        String message = intent.getStringExtra("message");
        String category = intent.getStringExtra("category");
        String identifier = intent.getStringExtra("identifier");

        Log.d("Log Android", "00======>title: " + title);
        Log.d("Log Android", "00======>message: " + message);

        if(message == null || message.isEmpty()) return;
        Intent intentToRepeat = new Intent(context, AppActivity.class).setAction(category);

        //set flag to restart/relaunch the app
        intentToRepeat.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        //Pending intent to handle launch of Activity in intent above
        PendingIntent pendingIntent =
                PendingIntent.getActivity(context, ID_1MINH, intentToRepeat, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationManager notificationManager = NotificationHelper.getNotificationManager(context);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
//            CharSequence name = category;
//            @SuppressLint("WrongConstant") NotificationChannel channel = new NotificationChannel(String.valueOf(ID_1MINH), category, NotificationManager.IMPORTANCE_DEFAULT);
//            channel.setDescription(message);
//
//            notificationManager.createNotificationChannel(channel);
            CharSequence name = "FreeChip";
            String description = "NGW";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("0", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
           // NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
            Notification repeatedNotification = buildLocalNotification(context, pendingIntent, title, message, category, identifier).build();

            //Send local notification
            notificationManager.notify(ID_1MINH, repeatedNotification);
            ID_1MINH++;
//        }
    }

    public NotificationCompat.Builder buildLocalNotification(Context context, PendingIntent pendingIntent, String title, String message, String category, String identifier) {
        Log.d("cocos", "00=====> Create notification!!!!");
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, String.valueOf(ID_1MINH))
                    .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentIntent(pendingIntent)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setCategory(category)
                    .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setAutoCancel(true);
        return builder;
    }
}
