import { BRAND_COLOR } from "@/lib/mantine/themes";
import { Overlay, Image } from "@mantine/core";

export type SendingTripWizardOverlayProps = {
  open: boolean;
};

export function SendingTripWizardOverlay({
  open,
}: Readonly<SendingTripWizardOverlayProps>) {
  return (
    <>
      {open && (
        <Overlay
          color={BRAND_COLOR[0]}
          backgroundOpacity={0.55}
          blur={6}
          style={{
            position: "fixed",
          }}
        >
          <Image
            style={{ animation: "flash 5s linear 0s infinite normal forwards" }}
            src="/assets/mascots/mimi_look_at_globe.png"
            alt="Mascot typing on laptop"
            h={250}
            fit="contain"
            mx="auto"
            mt="20vh"
          />
        </Overlay>
      )}
    </>
  );
}
