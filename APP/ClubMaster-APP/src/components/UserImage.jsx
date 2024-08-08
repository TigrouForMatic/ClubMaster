import React, { useMemo } from 'react';
import { getColorFromString } from '../js/color';
import styles from '../styles/UserImage.module.css';

const UserImage = ({ name, size = 60 }) => {
    const initials = useMemo(() => {
        return name
            .split(' ')
            .map(word => word[0].toUpperCase())
            .join('');
    }, [name]);

    const backgroundColor = useMemo(() => getColorFromString(name), [name]);

    // Calcule la taille du texte proportionnellement à la taille donnée
    const fontSize = size * 0.4;

    return (
        <div
            className={styles.profilePic}
            style={{ 
                backgroundColor, 
                width: `${size}px`, 
                height: `${size}px`, 
                fontSize: `${fontSize}px` 
            }}
        >
            <span>{initials}</span>
        </div>
    );
};

export default UserImage;
