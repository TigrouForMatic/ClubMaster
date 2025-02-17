import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { getDisplayFormatedDate } from '../../js/date';

const LicenceItem = ({ licence, isOld }) => (
  <Card className={`w-full transition-all hover:shadow-md ${isOld ? 'opacity-75' : ''}`}>
    <CardHeader className={`space-y-1 ${isOld ? 'bg-gray-100' : 'bg-primary/5'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{licence.eventType}</h3>
        <Badge variant={isOld ? "secondary" : "default"}>
          {licence.role}
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="space-y-4 pt-4">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {licence.clubLabel}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Début:</span>
            <p className="font-medium">{getDisplayFormatedDate(licence.startDate)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Fin:</span>
            <p className="font-medium">{getDisplayFormatedDate(licence.endDate)}</p>
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter className="flex flex-col space-y-2 pt-4">
      <Progress 
        value={(licence.duration - licence.daysLeft) / licence.duration * 100} 
        className="h-2 w-full"
      />
      {!isOld ? (
        <p className="text-sm text-green-600 font-medium">
          {licence.daysLeft} jours restants
        </p>
      ) : (
        <p className="text-sm text-red-600 font-medium">
          Licence expirée depuis {-licence.daysLeft} jours
        </p>
      )}
    </CardFooter>
  </Card>
);

export default LicenceItem;