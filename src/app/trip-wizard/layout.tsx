import { TripWizardProvider } from "@/app/trip-wizard/_hooks/useTripWizard";

export default function TripWizardStepLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TripWizardProvider>{children}</TripWizardProvider>;
}
