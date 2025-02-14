import React from 'react';

const BadgeSection = () => {
  const badges = [
    { name: 'Courses', progress: '3 courses / 5', color: 'bg-blue-500' },
    { name: 'Meetings', progress: '7 meetings / 7', color: 'bg-green-500' },
    { name: 'Tournament', progress: '1 tournament / 1', color: 'bg-purple-500' }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Mes Badges</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg border bg-card text-card-foreground shadow hover:shadow-md transition-all"
          >
            <div className="p-6">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 ${badge.color}`} />
              
              <div className="relative space-y-2">
                <h3 className="font-semibold tracking-tight text-lg">{badge.name}</h3>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`${badge.color} h-2 rounded-full`}
                        style={{
                          width: `${(parseInt(badge.progress.split('/')[0]) / parseInt(badge.progress.split('/')[1])) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs">{badge.progress}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BadgeSection;