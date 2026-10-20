import React from 'react';

// Componente universal para renderizar tanto imagens/fotos quanto emojis de avatares
export default function AvatarDisplay({ avatar, size = '36px', className = '' }) {
  const isImage = typeof avatar === 'string' && (
    avatar.startsWith('/') ||
    avatar.startsWith('http') ||
    avatar.startsWith('data:')
  );

  if (isImage) {
    return (
      <img
        src={avatar}
        alt="Avatar"
        className={`avatar-img-render ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <span
      className={`avatar-emoji-render ${className}`}
      style={{
        fontSize: `calc(${size} * 0.75)`,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {avatar || '👦🏽'}
    </span>
  );
}
