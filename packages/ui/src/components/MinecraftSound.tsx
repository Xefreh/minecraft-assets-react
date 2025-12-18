import { CSSProperties, FC } from 'react';

export type MinecraftSoundProps = {
  src: string;
  variant?: string;
  style?: CSSProperties;
  className?: string;
};

export const MinecraftSound: FC<MinecraftSoundProps> = ({
  src,
  style,
  variant = '',
  className,
}) => {
  return (
    <audio
      src={variant ? `${src}_${variant}` : src}
      style={style}
      className={className}
      controls
    />
  );
};

export default MinecraftSound;
