# Android ProGuard rules for R8
# This is the most common configuration:
#
# -keepattributes *Annotation*
# -keepclassmembers class * {
#     @<com.google.android.gms.common.annotation.KeepName> <methods>;
# }
#
# The -dontwarn option is used to suppress warnings for classes that are
# not part of your application.

# Preserve all native method names and the annotated JNI functions they call
-keepattributes *Annotation*, InnerClasses, Signature, SourceFile, LineNumberTable

# For native methods, keep the function name
-keep class * extends java.lang.Object {
    native <methods>;
}

# Keep all classes in the application package
-keep class com.magicalbattle.** { *; }

# Keep R class
-keep class **.R { *; }

# Keep all Activities, Services, BroadcastReceivers
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver

# Keep all View classes
-keep public class * extends android.view.View {
    public <constructor>(android.content.Context);
    public <constructor>(android.content.Context, android.util.AttributeSet);
    public <constructor>(android.content.Context, android.util.AttributeSet, int);
}

# Keep all Parcelable classes
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
