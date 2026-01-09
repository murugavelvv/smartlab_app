# Smart Lab Analyzer Pro - Flutter Version

A comprehensive lab management system for educational institutions built with Flutter.

## Features

- **Dashboard**: Overview with key metrics and performance trends
- **Student Management**: Add, edit, and manage student profiles
- **Lab Records**: Track experiment marks and performance
- **Interactive Attendance & Marks Entry**: Mark attendance and enter observation/record marks for each student
- **Lab Session Management**: Create and manage lab sessions with detailed information
- **Task Management**: Create and assign tasks to students
- **Dark/Light Theme**: Toggle between themes
- **Beautiful UI**: Modern Material Design 3 interface
- **Charts**: Performance visualization with fl_chart

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / VS Code
- Android Emulator or Physical Device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart_lab_analyzer_pro
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── student.dart
│   ├── lab_session.dart
│   ├── attendance.dart
│   └── task.dart
├── providers/                # State management
│   └── app_provider.dart
├── screens/                  # UI screens
│   ├── dashboard_screen.dart
│   ├── students_screen.dart
│   ├── live_attendance_screen.dart
│   ├── add_lab_session_screen.dart
│   ├── analytics_screen.dart
│   └── settings_screen.dart
├── widgets/                  # Reusable widgets
│   └── stat_card.dart
└── utils/                    # Utilities
    └── theme.dart
```

## Dependencies

- `provider`: State management
- `fl_chart`: Charts and graphs
- `shared_preferences`: Local storage
- `intl`: Internationalization
- `table_calendar`: Calendar widget
- `image_picker`: Image selection
- `file_picker`: File selection
- `url_launcher`: URL handling
- `flutter_svg`: SVG support
- `cached_network_image`: Image caching

## FlutLab Integration

This project is designed to work with FlutLab. To run it on FlutLab:

1. Upload the project files to FlutLab
2. The project will automatically detect Flutter dependencies
3. Click "Run" to start the app in the FlutLab environment

## Features in Detail

### Dashboard
- Real-time statistics cards
- Performance trend charts
- Quick action buttons
- Recent activity feed
- Quick Add section for lab sessions and attendance
- Modern card-based layout with gradients
- Enhanced navigation to key features

### Student Management
- Student profiles with photos
- Department and batch information
- Contact details
- Academic records

### Interactive Attendance & Marks Entry
- Mark attendance status (Present, Absent, On-Duty)
- Enter observation marks for each session
- Enter record marks for each session
- Real-time attendance statistics
- Search and filter students

### Lab Session Management
- Create new lab sessions with detailed information
- Session topic and experiment name
- Date and batch selection
- Instructor assignment
- Observation and record marks entry
- Lab room and equipment details
- Session status tracking

### Lab Records
- Experiment tracking
- Marks breakdown (Record, Observation, Program)
- Performance analytics
- Remarks and feedback

### Attendance
- **Live Attendance Screen**: Full-screen dedicated attendance interface
- Date picker for selecting attendance date
- Interactive toggle buttons for Present, Absent, On-Duty status
- Real-time attendance statistics
- Search functionality to find students quickly
- Save attendance data with confirmation
- Daily attendance marking
- Present/Absent/On-Duty status
- Attendance history
- Calendar view

### Task Management
- Task creation and assignment
- Due date tracking
- Status updates
- Student assignment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
