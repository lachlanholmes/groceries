# Grocery List App

A modern React application for managing your grocery shopping list. Built with React and TypeScript, featuring real-time data persistence using Supabase as the backend.

## Features

- ✅ Add items to your shopping list
- ✅ Mark items as completed
- ✅ Remove items from the list
- ✅ Cloud storage with Supabase
- ✅ Clean, modern interface

## Built With

- React 18
- TypeScript
- Supabase (Database)
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A Supabase account and project

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd GroceryList
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database by running this SQL in your Supabase SQL editor:
```sql
-- Create the grocery_items table
create table grocery_items (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  completed boolean default false not null,
  user_id text not null
);

-- Enable Row Level Security (RLS)
alter table grocery_items enable row level security;

-- Create a policy that allows all operations for now
create policy "Allow all operations" on grocery_items
  for all
  using (true)
  with check (true);
```

5. Start the development server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
grocery-list/
├── src/
│   ├── components/     # React components
│   │   ├── GroceryList.tsx
│   │   └── GroceryList.css
│   ├── lib/           # Utility functions and configurations
│   │   └── supabase.ts
│   ├── types/         # TypeScript type definitions
│   │   └── database.ts
│   ├── App.tsx        # Main application component
│   └── index.tsx      # Application entry point
├── public/            # Static files
└── package.json       # Project dependencies and scripts
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Environment Variables

The following environment variables are required:

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Roadmap

- User authentication
- Multiple lists per user
- List sharing capabilities
- Real-time updates using Supabase subscriptions
- Item categories
- Quantity tracking

Please open an issue for any bugs or feature suggestions.
