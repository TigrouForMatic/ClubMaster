import React, { useMemo } from 'react';
import { getColorFromString } from '../js/color';

const UserImage = ({ name = '', size = 60 }) => {
    const initials = useMemo(() => {
        if (!name) return '?';
        return name
            .trim()
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0]?.toUpperCase() || '')
            .join('');
    }, [name]);

    const backgroundColor = useMemo(() => getColorFromString(name || ''), [name]);

    // Calcule la taille du texte proportionnellement à la taille donnée
    const fontSize = size * 0.4;

    return (
        <div
            className={`
                flex items-center justify-center
                rounded-full
                text-white
                mr-4
                uppercase
                transition-all
                duration-200
                hover:opacity-90
                select-none
            `}
            style={{ 
                backgroundColor, 
                width: `${size}px`, 
                height: `${size}px`, 
                fontSize: `${fontSize}px` 
            }}
        >
            <span className="font-medium">{initials}</span>
        </div>
    );
};

export default UserImage;