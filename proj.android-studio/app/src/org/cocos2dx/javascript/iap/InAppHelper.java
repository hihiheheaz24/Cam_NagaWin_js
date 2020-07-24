package org.cocos2dx.javascript.iap;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.iap.util.IabHelper;
import org.cocos2dx.javascript.iap.util.IabResult;
import org.cocos2dx.javascript.iap.util.Inventory;
import org.cocos2dx.javascript.iap.util.Purchase;
import org.cocos2dx.javascript.iap.util.SkuDetails;
import org.cocos2dx.javascript.AppActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class InAppHelper {
    private final String TAG = InAppHelper.class.getSimpleName();
    public String iap_key="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArHI85BbRJ5d8jQDlIZfeOmZGbwqVxNZdSMEZH8AROk3i0CLkdgIN5gdZPXjeUGFrK3Vi2+D7Um9OgF/lN1pp6kAnNSj52UUZBO90eRxGZkfHPeVi+irnD8nlb9+AAvkU+ccEndH2l/p7/gGfk5vGJCHaR591qlCLFtsGKZjHSBdPkzdCkzfllAQSsmyC3g5fn6RqERB6UKgjK1QdmNZIK5IaB4yXsuqjA/hm9GNGsRhE3IV6plmd/DRZC+Xu2LYA7lPUqN2ZzX3vuUNVmmrbDkvKfkCX/MVF9DMiHMeb1oPb9TEBGixhX1Q/rgDD1JkWOgO+r7Q5nCZkiF9pA/+hWwIDAQAB";
//    public List<String> SKU_ITEM = new ArrayList<String>();
    IabHelper.OnConsumeFinishedListener mConsumeFinishedListener =
            new IabHelper.OnConsumeFinishedListener() {
                public void onConsumeFinished(Purchase purchase,
                                              IabResult result) {

                    if (result.isSuccess()) {
                        // BUY OK
                        Toast.makeText(mContext, "Buy OK", Toast.LENGTH_LONG).show();
                    } else {
                        // handle error
                        Toast.makeText(mContext, "Buy ERROR", Toast.LENGTH_LONG).show();
                    }
                }
            };
    private Context mContext;
    public IabHelper mHelper;
    private String ITEM_SKU="";
    IabHelper.QueryInventoryFinishedListener mReceivedInventoryListener
            = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result,
                                             Inventory inventory) {

            if (result.isSuccess() && mHelper != null) {

            	
            	
                mHelper.consumeAsync(inventory.getPurchase(ITEM_SKU),
                        mConsumeFinishedListener);
            }
        }
    };
    IabHelper.OnIabPurchaseFinishedListener mPurchaseFinishedListener
            = new IabHelper.OnIabPurchaseFinishedListener() {
        public void onIabPurchaseFinished(IabResult result,
                                          Purchase purchase) {

            if (purchase != null) {

                Log.v(TAG, "===onIabPurchaseFinished => " + purchase.getSku()
                        + "  " + purchase.getSignature()
                        + "   " + purchase.getOriginalJson());

                if (result.isFailure()) {
                    Log.v(TAG, "onIabPurchaseFinished -> isFailure");
                    return;
                } else {
                	 Log.v(TAG, "onIabPurchaseFinished -> success");
                    try {
                        JSONObject info = new JSONObject();
                        info.put("signature", purchase.getSignature());
                        info.put("signedData", purchase.getOriginalJson());
//                       AppActivity.save_ins.sendToJavascriptBitch(info.toString());//gửi sang cocos
                        AppActivity.save_ins.sendToJavascriptBitch("100", purchase.getOriginalJson());//gửi sang cocos
                        AppActivity.save_ins.sendToJavascriptBitch("101", purchase.getSignature());//gửi sang cocos
                        mHelper.consumeAsync(purchase, mOnConsumeFinishedListener);
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }
    };
	IabHelper.OnConsumeFinishedListener mOnConsumeFinishedListener = new IabHelper.OnConsumeFinishedListener() {
		@Override
		public void onConsumeFinished(Purchase purchase, IabResult result) {
			Log.d(TAG, "mOnConsumeFinishedListener: " + result);
			if (result.isFailure()) {
				Log.d(TAG, "Error consuming");
                String str = "{\"functionName\":10305,\"params\":[\"ErrorConsuming\"]}";
//                AppActivity.callOut(str);
				return;
			} else if (purchase.getSku().equals(ITEM_SKU)) {
				Log.d(TAG, "Successful consuming");
			}
		}
	};
    public InAppHelper(Context mContext) {
        this.mContext = mContext;
    }

    public void onCreate() {
        mHelper = new IabHelper(mContext, iap_key);
        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
        public void onIabSetupFinished(IabResult result) {
        	if (!result.isSuccess()) {
        		Log.d(TAG, "In-app Billing setup failed: " + result);
             } else {
                Log.d(TAG, "In-app Billing is set up OK");
              }
           }
       });
    }

    public void consumeItem() {
        if (mHelper != null) {
            mHelper.queryInventoryAsync(mReceivedInventoryListener);
        }
    }

    public boolean onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mHelper == null) {
            return false;
        }

        return mHelper.handleActivityResult(requestCode, resultCode, data);
    }

    public void buyItem(String itemId) {
    	Log.d("buyItem", itemId);
//        if (position >= SKU_ITEM.size() || position< 0) {
//            return;
//        }
//        ITEM_SKU = SKU_ITEM.get(position);
        try{
            ITEM_SKU = itemId;
            if (mHelper != null) {
                Log.d("IAP", "==========a:   chay mua");
                mHelper.launchPurchaseFlow((Activity) mContext, ITEM_SKU, 10001,
                        mPurchaseFinishedListener, "");
            }else{

                Log.d("IAP", "==========a:   bi null roi chay vao day");
                onCreate();
                if (mHelper != null)
                    mHelper.launchPurchaseFlow((Activity) mContext, ITEM_SKU, 10001,
                        mPurchaseFinishedListener, "");
            }

            Log.d("IAP", "==========a:   null cmnr");

        }catch (Exception e){
            e.printStackTrace();
        }
    }
    public IabHelper.QueryInventoryFinishedListener mReceivedListInventoryListener
    		= new IabHelper.QueryInventoryFinishedListener() {
    public void onQueryInventoryFinished(IabResult result,
                                     Inventory inventory) {

    if (result.isSuccess() && mHelper != null) {
    	ArrayList<String> gold = new ArrayList<String>();
    	ArrayList<String> price = new ArrayList<String>();
    	for (SkuDetails skuDetails : inventory.mSkuMap.values()) {
    		gold.add(skuDetails.getTitle());
    		price.add(skuDetails.getPrice());
    	}
//    	if(gold.size() > 0){
//    		AppActivity.save_ins.sendToJavascript(6,new JSONArray(gold).toString());
//    		AppActivity.save_ins.sendToJavascript(7,new JSONArray(price).toString());
//    	}
    }
    else{
//    	AppActivity.save_ins.sendToJavascript(8,"");
    }
    }
};
    public void getListItem(){
        try {
//    	if (mHelper != null)
//    		mHelper.queryInventoryAsync(true, SKU_ITEM,mReceivedListInventoryListener);
        }catch (Exception e){
            e.printStackTrace();
        }

    }
    public void onDestroy() {
        if (mHelper != null) mHelper.dispose();
        mHelper = null;
    }

}
