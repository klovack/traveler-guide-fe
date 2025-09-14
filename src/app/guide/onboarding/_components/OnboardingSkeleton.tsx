import { Skeleton, Group } from "@mantine/core";

export type OnboardingSkeletonProps = {
  numberOfFields: number;
};

export function OnboardingSkeleton(props: Readonly<OnboardingSkeletonProps>) {
  const { numberOfFields } = props;
  return (
    <>
      {Array.from({ length: numberOfFields }).map((_, index) => (
        <Skeleton key={index} mt={16} height={24} radius="sm" />
      ))}

      <Group justify="space-between" mt="lg">
        <Skeleton width={100} height={36} radius="sm" />
        <Skeleton width={100} height={36} radius="sm" />
      </Group>
    </>
  );
}
