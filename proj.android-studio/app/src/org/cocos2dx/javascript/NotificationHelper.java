package org.cocos2dx.javascript;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.SystemClock;
import android.util.Log;

import java.util.ArrayList;
import java.util.Calendar;

import static android.content.Context.ALARM_SERVICE;

/**
 * Created by ptyagi on 4/17/17.
 */

public class NotificationHelper {
//    public static int ALARM_TYPE_RTC = 100;
//    private static AlarmManager alarmManagerRTC;
//    private static PendingIntent alarmIntentRTC;

    private static ArrayList<AlarmManager> listAlarmManagerRTC = new ArrayList<>();
    private static ArrayList<PendingIntent> listAlarmIntentRTC = new ArrayList<>();

    private static ArrayList<AlarmManager> listAlarmManagerEveryDay = new ArrayList<>();
    private static ArrayList<PendingIntent> listAlarmIntentEveryDay = new ArrayList<>();

    private static ArrayList<AlarmManager> listAlarmManagerElapsed = new ArrayList<>();
    private static ArrayList<PendingIntent> listAlarmIntentElapsed = new ArrayList<>();

    /**
     * This is the real time /wall clock time
     * @param context
     */

    static int ID_1MINH = 0;
    static int ID_1MINH1 = 0;
    static int ID_1MINH2 = 0;
    public static void scheduleRepeatingRTCNotification(Context context, String title, String message, String category, String identifier, int time) {
        //get calendar instance to be able to select what time notification should be scheduled
//        Calendar calendar = Calendar.getInstance();
//        calendar.setTimeInMillis(System.currentTimeMillis());
        //Setting time of the day (8am here) when notification will be sent every day (default)
//        calendar.set(Calendar.HOUR_OF_DAY,
//                0,
//                1);
        long timeMili = System.currentTimeMillis() + time*1000;
//        calendar.set(Calendar.SECOND, time);
        //Setting intent to class where Alarm broadcast message will be handled
        Intent intent = new Intent(context, AlarmReceiver.class);

        intent.putExtra("title", title);
        intent.putExtra("message", message);
        intent.putExtra("category", category);
        intent.putExtra("identifier", identifier);

        //Setting alarm pending intent
        PendingIntent alarmIntentRTC = PendingIntent.getBroadcast(context, ++ID_1MINH, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        //getting instance of AlarmManager service
        AlarmManager alarmManagerRTC = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);

        //Setting alarm to wake up device every day for clock time.
        //AlarmManager.RTC_WAKEUP is responsible to wake up device for sure, which may not be good practice all the time.
        // Use this when you know what you're doing.
        //Use RTC when you don't need to wake up device, but want to deliver the notification whenever device is woke-up
        //We'll be using RTC.WAKEUP for demo purpose only
//        alarmManagerRTC.setInexactRepeating(AlarmManager.RTC_WAKEUP,
//                timeMili, AlarmManager.INTERVAL_DAY, alarmIntentRTC);
        alarmManagerRTC.setExact(AlarmManager.RTC_WAKEUP, timeMili, alarmIntentRTC);

        listAlarmIntentRTC.add(alarmIntentRTC);
        listAlarmManagerRTC.add(alarmManagerRTC);
    }
    public static void scheduleRepeatingNotificationEveryDay(Context context, String title, String message, String category, String identifier, int time) {
        int houCon = time/3600;
        int minCon = (time - houCon*3600)/60;

        Log.d("cocos", "===> scheduleRepeatingNotificationEveryDay: houCon " + houCon);
        Log.d("cocos", "===> scheduleRepeatingNotificationEveryDay: minCon " + minCon);

        Calendar calendar = Calendar.getInstance();
//        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.set(Calendar.HOUR_OF_DAY, houCon);
        calendar.set(Calendar.MINUTE, minCon);
        calendar.set(Calendar.SECOND, 00);

        long startUpTime = calendar.getTimeInMillis();
        if (System.currentTimeMillis() > startUpTime) {
            startUpTime += AlarmManager.INTERVAL_DAY;
        }

        //Setting intent to class where Alarm broadcast message will be handled
        Intent intent = new Intent(context, AlarmReceiver.class);

        intent.putExtra("title", title);
        intent.putExtra("message", message);
        intent.putExtra("category", category);
        intent.putExtra("identifier", identifier);
      //  intent.putExtra("data", strData);

        //Setting alarm pending intent
        PendingIntent alarmIntentRTC = PendingIntent.getBroadcast(context, ++ID_1MINH2, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        //getting instance of AlarmManager service
        AlarmManager alarmManagerRTC = (AlarmManager)context.getSystemService(ALARM_SERVICE);

        //Setting alarm to wake up device every day for clock time.
        //AlarmManager.RTC_WAKEUP is responsible to wake up device for sure, which may not be good practice all the time.
        // Use this when you know what you're doing.
        //Use RTC when you don't need to wake up device, but want to deliver the notification whenever device is woke-up
        //We'll be using RTC.WAKEUP for demo purpose only
//        alarmManagerRTC.setInexactRepeating(AlarmManager.RTC_WAKEUP,
//                timeMili, AlarmManager.INTERVAL_DAY, alarmIntentRTC);
        alarmManagerRTC.setRepeating(AlarmManager.RTC_WAKEUP, startUpTime, AlarmManager.INTERVAL_DAY, alarmIntentRTC);

//        alarmManagerRTC.setInexactRepeating(AlarmManager.RTC_WAKEUP, startUpTime, AlarmManager.INTERVAL_DAY, alarmIntentRTC);
        listAlarmIntentEveryDay.add(alarmIntentRTC);
        listAlarmManagerEveryDay.add(alarmManagerRTC);
    }
    /***
     * This is another way to schedule notifications using the elapsed time.
     * Its based on the relative time since device was booted up.
     * @param context
     */
    public static void scheduleRepeatingElapsedNotification(Context context) {
        //Setting intent to class where notification will be handled
        Intent intent = new Intent(context, AlarmReceiver.class);

        //Setting pending intent to respond to broadcast sent by AlarmManager everyday at 8am
        PendingIntent alarmIntentElapsed = PendingIntent.getBroadcast(context, ++ID_1MINH1, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        //getting instance of AlarmManager service
        AlarmManager alarmManagerElapsed = (AlarmManager)context.getSystemService(ALARM_SERVICE);

        //Inexact alarm everyday since device is booted up. This is a better choice and
        //scales well when device time settings/locale is changed
        //We're setting alarm to fire notification after 15 minutes, and every 15 minutes there on
        alarmManagerElapsed.setInexactRepeating(AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + AlarmManager.INTERVAL_FIFTEEN_MINUTES, 10000 ,alarmIntentElapsed);

        listAlarmIntentElapsed.add(alarmIntentElapsed);
        listAlarmManagerElapsed.add(alarmManagerElapsed);
    }

    public static void cancelAlarmRTC() {
//        if (alarmManagerRTC!= null) {
//            alarmManagerRTC.cancel(alarmIntentRTC);
//        }
        Log.v("Log Android", "0====>So luong:    " + listAlarmManagerRTC.size());
        Log.v("Log Android", "1====>So luong:    " + listAlarmIntentRTC.size());
        for(int i = 0; i < listAlarmManagerRTC.size(); i++){
            listAlarmManagerRTC.get(i).cancel(listAlarmIntentRTC.get(i));
        }
    }
    public static void cancelAlarmEveryDay() {
//        if (alarmManagerRTC!= null) {
//            alarmManagerRTC.cancel(alarmIntentRTC);
//        }
        Log.v("Log Android", "0====>So luong:    " + listAlarmManagerRTC.size());
        Log.v("Log Android", "1====>So luong:    " + listAlarmIntentRTC.size());
        for(int i = 0; i < listAlarmManagerEveryDay.size(); i++){
            listAlarmManagerEveryDay.get(i).cancel(listAlarmIntentEveryDay.get(i));
        }
    }
    public static void cancelAlarmElapsed() {
//        if (alarmManagerElapsed!= null) {
//            alarmManagerElapsed.cancel(alarmIntentElapsed);
//        }
        Log.v("Log Android", "2====>So luong:    " + listAlarmManagerRTC.size());
        Log.v("Log Android", "3====>So luong:    " + listAlarmIntentRTC.size());
        for(int i = 0; i < listAlarmManagerElapsed.size(); i++){
            listAlarmManagerElapsed.get(i).cancel(listAlarmIntentElapsed.get(i));
        }
    }

    public static NotificationManager getNotificationManager(Context context) {
        return (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    /**
     * Enable boot receiver to persist alarms set for notifications across device reboots
     */
    public static void enableBootReceiver(Context context) {
        ComponentName receiver = new ComponentName(context, AlarmBootReceiver.class);
        PackageManager pm = context.getPackageManager();

        pm.setComponentEnabledSetting(receiver,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP);
    }

    /**
     * Disable boot receiver when user cancels/opt-out from notifications
     */
    public static void disableBootReceiver(Context context) {
        ComponentName receiver = new ComponentName(context, AlarmBootReceiver.class);
        PackageManager pm = context.getPackageManager();

        pm.setComponentEnabledSetting(receiver,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);
    }
}
