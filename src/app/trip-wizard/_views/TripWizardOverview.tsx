"use client";
import React from "react";
import { Button, Stack, Title } from "@mantine/core";
import ItineraryMap from "../_components/ItineraryMap";
import { OverviewMoodboard } from "../_components/overview/OverviewMoodboard";
import { OverviewTimeline } from "../_components/overview/OverviewTimeline";
import { OverviewControls } from "../_components/overview/OverviewControls";
import { useTripWizard } from "@/hooks/useTripWizard";
import { redirect, useParams } from "next/navigation";

export default function TripWizardOverview() {
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

  return (
    <>
      {hasTripWizard && (
        <Stack gap="xl" mx="auto" py="xl" className="w-full md:max-w-9/10">
          <Title order={3} ta="center">
            {tripWizard.title}
          </Title>
          <OverviewMoodboard
            summary={tripWizard.mood_board_text}
            tags={tripWizard.interests ?? []}
          />
          <ItineraryMap
            locations={tripWizard.location_details}
            isRoundTrip={tripWizard.is_round_trip}
          />
          <OverviewTimeline days={tripWizard.suggested_itinerary} />
          <OverviewControls />
          <Button size="xl" color="blue" radius="xl">
            Continue to Guides
          </Button>
        </Stack>
      )}
    </>
  );
}
