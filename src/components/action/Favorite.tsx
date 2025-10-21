import { STORAGE_KEYS } from "@/constants/localStorageKeys";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export type FavoriteProps = {
  type: "trip"; // more types can be added in the future
  item: string;
};

export function Favorite(props: Readonly<FavoriteProps>) {
  const t = useTranslations("common.favorite");
  const [favoriteTrips, setFavoriteTrips] = useLocalStorage({
    key: STORAGE_KEYS.TRIP_WIZARD_FAVORITE_ITINERARIES,
    defaultValue: [] as string[],
  });

  const handleFavorite = () => {
    setFavoriteTrips((prev) => {
      const isInFavorite = favoriteTrips.includes(props.item);

      if (isInFavorite) {
        return prev.filter((favId) => favId !== props.item);
      }

      return [...prev, props.item];
    });
  };

  const isInFavorite = useMemo(() => {
    return favoriteTrips.includes(props.item);
  }, [favoriteTrips, props.item]);

  return (
    <Tooltip label={isInFavorite ? t("add") : t("remove")}>
      <ActionIcon variant="subtle" onClick={handleFavorite}>
        {isInFavorite ? <IconHeartFilled /> : <IconHeart />}
      </ActionIcon>
    </Tooltip>
  );
}
