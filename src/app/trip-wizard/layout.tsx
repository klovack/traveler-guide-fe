import { TripWizardFormProvider } from "@/app/trip-wizard/_hooks/useTripWizardForm";

export default function TripWizardStepLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TripWizardFormProvider>{children}</TripWizardFormProvider>;
}
