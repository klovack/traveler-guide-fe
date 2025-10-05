import { Paper, Image, PaperProps } from "@mantine/core";

export type CardImageProps = PaperProps & {
  src: string;
  alt: string | undefined;
  imageStyle?: React.CSSProperties;
  imageClassName?: string;
};

export function CardImage(props: CardImageProps) {
  return (
    <Paper
      style={{ overflow: "hidden", zIndex: 0, ...props.style }}
      className={props.className}
      {...props}
    >
      <Image
        src={props.src}
        alt={props.alt}
        h="100%"
        fit="cover"
        style={props.imageStyle}
        className={props.imageClassName}
      />
    </Paper>
  );
}
