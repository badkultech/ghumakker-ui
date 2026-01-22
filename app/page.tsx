// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Immediately redirect user to /prelaunch
  redirect('/prelaunch/travelers');
}
