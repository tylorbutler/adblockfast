package com.rocketshipapps.adblockfast.service;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.rocketshipapps.adblockfast.AdblockFastApplication;

public class UpdateReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        final PendingResult result = goAsync();

        new Thread(() -> {
            String action = intent.getAction();

            if (action != null) {
                // TODO: Use “NotificationManager” and “PendingIntent” to launch app on update
                switch (action) {
                    case Intent.ACTION_MY_PACKAGE_REPLACED:

                    AdblockFastApplication.handlePrefs(context);
                    context.sendBroadcast(AdblockFastApplication.blockingUpdateIntent);

                    break;

                    case Intent.ACTION_PACKAGE_REPLACED:

                    Uri data = intent.getData();

                    if (
                        data != null &&
                            "com.sec.android.app.sbrowser".equals(data.getSchemeSpecificPart())
                    ) {
                        context.sendBroadcast(AdblockFastApplication.blockingUpdateIntent);
                    }
                }
            }

            result.finish();
        }).start();
    }
}
