"use client";

import { STORAGE_KEYS } from "@/constants/localStorageKeys";
import { useTripWizardsByIds } from "@/hooks/useTripWizard";
import {
  ActionIcon,
  Indicator,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconHeart } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function FavoriteList() {
  const [favoriteTrips, setFavoriteTrips] = useLocalStorage({
    key: STORAGE_KEYS.TRIP_WIZARD_FAVORITE_ITINERARIES,
    defaultValue: [] as string[],
  });
  const router = useRouter();

  const { data: tripWizards } = useTripWizardsByIds(favoriteTrips);

  return (
    <Menu>
      <MenuTarget>
        <Indicator
          size={12}
          offset={4}
          c="dimmed"
          withBorder
          disabled={favoriteTrips.length === 0}
        >
          <ActionIcon variant="transparent" c="dimmed">
            <IconHeart />
          </ActionIcon>
        </Indicator>
      </MenuTarget>

      <MenuDropdown>
        <MenuLabel>Favorite Trips</MenuLabel>

        <MenuDivider />

        {favoriteTrips.length === 0 && (
          <MenuItem disabled>No favorite trips yet</MenuItem>
        )}

        {tripWizards?.map((trip) => (
          <MenuItem
            key={trip.id}
            onClick={() => {
              router.push(`/trip-wizard/itinerary/${trip.id}`);
            }}
          >
            {trip.title}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
