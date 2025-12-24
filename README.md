# healthSync

## Project Summary
HealthSync is a cross-platform mobile application designed to streamline health data management, blood donation requests, and personalized health plans. Built for hackathons and real-world use, it leverages modern cloud and mobile technologies to connect users, donors, and healthcare providers.

## Setup and Run Instructions

### Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install)
- Dart (comes with Flutter)
- Android Studio/Xcode (for mobile builds)
- Node.js & npm (for backend/supabase functions, if modifying backend)

### Running the App
1. Clone the repository:
	```bash
	git clone <repo-url>
	cd healthSync
	```
2. Install dependencies:
	```bash
	cd health_sync
	flutter pub get
	```
3. Run the app:
	```bash
	flutter run
	```
4. For backend functions (optional):
	- See `backend/supabase/README.md` or relevant function folders for setup.

## Tech Stack and Dependencies
- **Frontend:** Flutter (Dart)
- **Backend:** Supabase Edge Functions (TypeScript/JavaScript)
- **Cloud:** Supabase
- **Mobile Platforms:** Android, iOS, Web, Desktop (Windows, macOS, Linux)
- **Key Dependencies:**
  - `flutter`, `provider`, `http`, `firebase_core`, `supabase_flutter`, etc.

## Architecture Overview
- **Flutter App:**
  - `lib/` contains core logic, features, shared widgets, and models.
  - Platform-specific code in `android/`, `ios/`, `web/`, `windows/`, `macos/`, `linux/`.
- **Backend:**
  - `backend/supabase/functions/` contains serverless functions for health plan generation, blood requests, notifications, etc.
- **State Management:** Provider pattern.
- **Cloud Integration:** Supabase for authentication, database, and serverless functions.

---
For more details, see the `health_sync/README.md` and documentation in each feature folder.
