# Mapuka

## Introduction

Mapuka is a mobile application designed for users who love exploring new locations and preserving memories of their journeys. Whether discovering a new city, hiking through nature, or tracking daily movements, Mapuka provides an interactive way to visualize exploration progress.

At the core of Mapuka is the **Fog of War** mechanic, where unexplored areas of the map remain hidden until the user visits them. This encourages users to explore new areas while also serving as a digital travel journal.

## Features

- **Fog of War**: Maps start obscured and reveal areas as users explore.
- **Personalized Notes and Spots**: Save specific locations with notes and details.
- **Leaderboard**: Compete with other users based on the amount of explored area.
- **Profile Customization**: Update profile details and track achievements.
- **Real-time Location Tracking**: Navigate using an interactive map powered by Mapbox.

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, and RLS Security)
- **Map Services**: Mapbox

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/sebaxe07/mapuka.git
   cd mapuka
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with the following values:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```
4. Run the application:
   ```sh
   expo start
   ```

## Usage

- **Sign up or log in** to start tracking your journeys.
- **Explore new areas** to clear the Fog of War on the map.
- **Save notes and spots** to keep track of interesting locations.
- **Check the leaderboard** to see your ranking among other explorers.

## Contribution

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to your branch: `git push origin feature-branch-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

## Contact

For inquiries or support, contact the authors:

- **Sebastian Enrique Perea Lopez**
- **Daniel Mauricio Ruiz Suarez**
- **Raul Eduardo Vergara Lacouture**
