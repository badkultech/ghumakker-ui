import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils";

export default function OrganizerPage() {
  redirect(ROUTES.ORGANIZER.DASHBOARD);
}
