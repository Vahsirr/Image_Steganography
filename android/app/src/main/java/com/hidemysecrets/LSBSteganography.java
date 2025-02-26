package com.hidemysecrets;

import android.graphics.Bitmap;

import android.graphics.BitmapFactory;
import android.graphics.Color;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

public class LSBSteganography extends ReactContextBaseJavaModule {

    public LSBSteganography(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LSBSteganography";
    }

    @ReactMethod
    public void encodeMessage(String message, String coverImageFilePath, String stegoImageFilePath, Promise promise) {
        try {
            Uri stegoImageUri = Uri.parse(stegoImageFilePath);
            String[] projection = { MediaStore.Images.Media.DATA };
            Cursor cursor = getReactApplicationContext().getContentResolver().query(stegoImageUri, projection, null,
                    null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                stegoImageFilePath = cursor.getString(column_index);
                cursor.close();
            }
            File coverImageFile = new File(coverImageFilePath);
            File stegoImageFile = new File(stegoImageFilePath);
            System.out.println(coverImageFilePath);

            // Check if cover image file exists and can be read
            if (!coverImageFile.exists() || !coverImageFile.canRead()) {
                throw new IOException("Cover image file does not exist or cannot be read");
            }

            // Load cover image
            Bitmap coverImage = BitmapFactory.decodeFile(coverImageFile.getAbsolutePath());

            if (coverImage == null) {
                throw new IOException("Failed to load cover image");
            }

            // Create stego image
            Bitmap stegoImage = Bitmap.createBitmap(coverImage.getWidth(), coverImage.getHeight(),
                    Bitmap.Config.ARGB_8888);
            promise.resolve(coverImageFile.getAbsolutePath());

            // Encode message into stegoImage using LSB steganography
            int messageLength = message.length();
            int messageIndex = 0;
            for (int y = 0; y < coverImage.getHeight(); y++) {
                for (int x = 0; x < coverImage.getWidth(); x++) {
                    int coverPixel = coverImage.getPixel(x, y);
                    int stegoPixel = coverPixel;
                    if (messageIndex < messageLength) {
                        int messageChar = message.charAt(messageIndex);
                        int bitIndex = 7;
                        for (int i = 0; i < 8; i++) {
                            int bit = (messageChar >> i) & 1;
                            stegoPixel = Color.argb(
                                    Color.alpha(stegoPixel),
                                    Color.red(stegoPixel) & ~(1 << bitIndex) | (bit << bitIndex),
                                    Color.green(stegoPixel),
                                    Color.blue(stegoPixel));
                            bitIndex--;
                        }
                        messageIndex++;
                    }
                    stegoImage.setPixel(x, y, stegoPixel);
                }
            }

            // Save stegoImage to file
            FileOutputStream fos = new FileOutputStream(stegoImageFile);
            stegoImage.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();

            promise.resolve("Stego image saved successfully.");
        } catch (IOException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void decodeMessage(String stegoImageFilePath, Promise promise) {
        try {
            Uri stegoImageUri = Uri.parse(stegoImageFilePath);
            String[] projection = { MediaStore.Images.Media.DATA };
            Cursor cursor = getReactApplicationContext().getContentResolver().query(stegoImageUri, projection, null,
                    null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                stegoImageFilePath = cursor.getString(column_index);
                cursor.close();
            }
            File stegoImageFile = new File(stegoImageFilePath);

            // Check if stego image file exists and can be read
            if (!stegoImageFile.exists() || !stegoImageFile.canRead()) {
                throw new IOException("Stego image file does not exist or cannot be read");
            }

            // Load stego image
            Bitmap stegoImage = BitmapFactory.decodeFile(stegoImageFile.getAbsolutePath());

            if (stegoImage == null) {
                throw new IOException("Failed to load stego image");
            }

            // Extract message from stegoImage using LSB steganography
            StringBuilder messageBuilder = new StringBuilder();
            int messageLength = 0;
            int messageIndex = 0;
            for (int y = 0; y < stegoImage.getHeight(); y++) {
                for (int x = 0; x < stegoImage.getWidth(); x++) {
                    int stegoPixel = stegoImage.getPixel(x, y);
                    int bitIndex = 7;
                    int messageChar = 0;
                    for (int i = 0; i < 8; i++) {
                        int bit = (Color.red(stegoPixel) >> bitIndex) & 1;
                        messageChar |= bit << i;
                        bitIndex--;
                    }
                    if (messageIndex == 0) {
                        messageLength = messageChar;
                        messageIndex++;
                    } else {
                        messageBuilder.append((char) messageChar);
                        messageIndex++;
                        if (messageIndex > messageLength) {
                            break;
                        }
                    }
                }
                if (messageIndex > messageLength) {
                    break;
                }
            }

            // Print or return extracted message
           String message = messageBuilder.toString();
            if (message.isEmpty()) {
                promise.resolve("No message found");
            } else if(message.charAt(0)!=' ') {
                promise.resolve("NO message Found");
            }else{
                promise.resolve(message);
            }
        } catch (IOException e) {
            promise.reject(e);
        }
    }
}
