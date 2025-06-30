import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to login page - auth middleware will handle dashboard redirect if logged in
  redirect("/login");
}
