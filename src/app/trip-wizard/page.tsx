import { redirect } from "next/navigation";
import { TRIP_WIZARD_STEPS } from "./constants";

export default function TripWizardPage() {
  redirect(`/trip-wizard/${TRIP_WIZARD_STEPS[0]}`);
}
