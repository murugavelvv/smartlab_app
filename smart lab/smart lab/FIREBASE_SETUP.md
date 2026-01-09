# Firebase Setup Guide for Smart Lab Analyzer Pro

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `smart-lab-analyzer-pro`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" authentication
3. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users
4. Click "Done"

## Step 4: Set Up Security Rules

In Firestore Database → "Rules", replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5: Download Configuration Files

### Android Configuration
1. In Firebase Console, go to "Project settings" (gear icon)
2. Click "Add app" → "Android"
3. Enter package name: `com.example.smart_lab_analyzer_pro`
4. Enter app nickname: `Smart Lab Analyzer Pro`
5. Click "Register app"
6. Download `google-services.json`
7. Replace the placeholder file in `android/app/google-services.json`

### iOS Configuration
1. Click "Add app" → "iOS"
2. Enter bundle ID: `com.example.smartLabAnalyzerPro`
3. Enter app nickname: `Smart Lab Analyzer Pro`
4. Click "Register app"
5. Download `GoogleService-Info.plist`
6. Replace the placeholder file in `ios/Runner/GoogleService-Info.plist`

## Step 6: Install Dependencies

Run the following command in your project directory:

```bash
flutter pub get
```

## Step 7: Test Firebase Connection

1. Run your app: `flutter run`
2. Check console for Firebase initialization messages
3. Try adding a student to test database connectivity

## Step 8: Production Security Rules

Before deploying to production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    
    // Lab sessions collection
    match /lab_sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Google Services plugin not found"**
   - Ensure `google-services.json` is in `android/app/`
   - Check that the plugin is added to `android/build.gradle`

2. **"Firebase not initialized"**
   - Verify `FirebaseService.initialize()` is called in `main()`
   - Check that all Firebase dependencies are installed

3. **"Permission denied"**
   - Verify Firestore security rules
   - Check that authentication is properly set up

4. **"Package name mismatch"**
   - Ensure package name in `google-services.json` matches your app
   - Check `android/app/build.gradle` for correct applicationId

### Testing Firebase Connection:

```dart
// Add this to any screen to test Firebase
ElevatedButton(
  onPressed: () async {
    try {
      final firebaseService = FirebaseService();
      await firebaseService.addStudent(Student(
        id: 'test',
        name: 'Test Student',
        rollNumber: 'TEST001',
        email: 'test@example.com',
        phone: '+1234567890',
        department: 'Computer Science',
        year: '2024',
      ));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Firebase connection successful!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Firebase error: $e')),
      );
    }
  },
  child: Text('Test Firebase Connection'),
)
```

## Next Steps

1. Set up user authentication screens
2. Implement real-time data synchronization
3. Add offline support with Firebase offline persistence
4. Set up Firebase Cloud Functions for advanced features
5. Configure Firebase Analytics and Crashlytics

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify all configuration files are properly placed
3. Ensure internet connectivity
4. Check Flutter and Firebase plugin versions compatibility
