import React from 'react';
import styles from '../../styles/BadgeSection.module.css';

const BadgeSection = () => {
  const badges = [
    { name: 'Courses', progress: '3 courses / 5' },
    { name: 'Meetings', progress: '7 meetings / 7' },
    { name: 'Tournament', progress: '1 tournament / 1' }
  ];

  return (
    <section className={styles.badgesSection}>
      <h2>My Badges</h2>
      <div className={styles.badgeList}>
        {badges.map((badge, index) => (
          <div key={index} className={styles.badge}>
            <p>{badge.name}</p>
            <p>{badge.progress}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BadgeSection;