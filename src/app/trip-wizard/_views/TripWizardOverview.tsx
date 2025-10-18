"use client";
import React, { useMemo } from "react";
import { Button, Flex, Stack, Title } from "@mantine/core";
import ItineraryMap from "../_components/ItineraryMap";
import { OverviewMoodboard } from "../_components/overview/OverviewMoodboard";
import { OverviewTimeline } from "../_components/overview/OverviewTimeline";
import { OverviewControls } from "../_components/overview/OverviewControls";
import { useTripWizard } from "@/hooks/useTripWizard";
import { redirect, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInterest } from "@/hooks/useInterest";
import { SendingTripWizardOverlay } from "@/components/overlay/SendingTripWizardOverlay";
import { TRIP_WIZARD_STEP } from "@/constants/tripWizard";

export default function TripWizardOverview() {
  const t = useTranslations("TripWizardPage.itinerary");
  const [isSendingRegenerate, setIsSendingRegenerate] = React.useState(false);

  const { steps } = useParams();
  if (!steps || steps.length < 2) {
    redirect("/trip-wizard");
  }
  const tripWizardId = steps[1];

  const { data: tripWizard, isLoading, isError } = useTripWizard(tripWizardId);

  const hasTripWizard = !isLoading && !isError && tripWizard;

  if (isError && !isLoading && !tripWizard) {
    redirect("/trip-wizard");
  }

  const { data: interest } = useInterest();

  const moodboardTag = useMemo(() => {
    if (!tripWizard?.interests || !interest) return [];

    const interestIdToInterest = interest.items.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<string, (typeof interest.items)[number]>);

    return tripWizard.interests
      .map((id) => interestIdToInterest[id] ?? null)
      .filter((i) => Boolean(i))
      .map((i) => i.name);
  }, [tripWizard?.interests, interest]);

  const itineraryStep: TRIP_WIZARD_STEP = "itinerary";

  return (
    <>
      {hasTripWizard && (
        <Stack gap="xl" mx="auto" py="xl" className="w-full md:max-w-9/10">
          <Title order={3} ta="center">
            {tripWizard.title}
          </Title>
          <OverviewMoodboard
            summary={tripWizard.mood_board_text}
            tags={moodboardTag}
          />
          <ItineraryMap
            locations={tripWizard.location_details}
            isRoundTrip={tripWizard.is_round_trip}
          />
          <OverviewTimeline days={tripWizard.suggested_itinerary} />
          <OverviewControls
            onRegenerateSend={() => setIsSendingRegenerate(true)}
            onRegenerateSuccess={(data) => {
              setIsSendingRegenerate(false);
              redirect(`/trip-wizard/${itineraryStep}/${data.id}`);
            }}
            onRegenerateError={(error) => {
              setIsSendingRegenerate(false);

              // TODO: show error notification
            }}
            tripWizard={tripWizard}
          />

          <Flex justify={{ base: "center", sm: "flex-end" }}>
            <Button>{t("actions.continueToBooking")}</Button>
          </Flex>
        </Stack>
      )}

      <SendingTripWizardOverlay open={isSendingRegenerate} />
    </>
  );
}
