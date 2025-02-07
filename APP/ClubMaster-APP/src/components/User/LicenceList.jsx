import React, { useState, useMemo } from 'react';
import useStore from '../../store/store';
import LicenceItem from './LicenceItem';
// import { Plus, ChevronUpCircle, ChevronDownCircle } from 'iconoir-react';
import { Plus, ChevronUpCircle, ChevronDownCircle } from 'lucide-react';
import ModalAddLicence from '../Modale/ModalAddLicence';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const LicenceList = () => {
  const { licences, licenceTypes, userClubs, roles } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOldLicences, setShowOldLicences] = useState(false);

  const oldLicences = useMemo(() => {
    const now = new Date();
    return licences
      .filter(e => new Date(e.df) < now)
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const licenceType = licenceTypes.find(t => t.id === e.licencetypeid);
        const club = userClubs.find(c => c.id === licenceType.clubid);
        const role = roles.find(r => r.id === e.roleid);
        const startDate = new Date(e.dd);
        const endDate = new Date(e.df);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const duration = (endDate - startDate) / 86400000;

        return {
          ...e,
          eventType: licenceType?.label || 'Unknown',
          clubLabel: club?.label || 'Unknown',
          role: role?.label || 'Aucun role',
          startDate,
          endDate,
          daysLeft,
          duration: duration || 365
        };
      });
  }, [licences, licenceTypes, userClubs, roles]);

  const filteredAndSortedLicences = useMemo(() => {
    const now = new Date();
    return licences
      .filter(e => new Date(e.df) > now)
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const licenceType = licenceTypes.find(t => t.id === e.licencetypeid);
        const club = userClubs.find(c => c.id === licenceType.clubid);
        const role = roles.find(r => r.id === e.roleid);
        const startDate = new Date(e.dd);
        const endDate = new Date(e.df);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const duration = (endDate - startDate) / 86400000;

        return {
          ...e,
          eventType: licenceType?.label || 'Unknown',
          clubLabel: club?.label || 'Unknown',
          role: role?.label || 'Aucun role',
          startDate,
          endDate,
          daysLeft,
          duration: duration || 365
        };
      });
  }, [licences, licenceTypes, userClubs, roles]);

  return (
    <Card className="w-full">
      <CardHeader className="relative flex flex-row items-center justify-center space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">Mes Licences</CardTitle>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          variant="default"
          className="absolute right-6 top-1/2 -translate-y-1/2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-full w-full rounded-md">
          {filteredAndSortedLicences.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedLicences.map((licence) => (
                <LicenceItem key={licence.id} licence={licence} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune licence active.
            </p>
          )}

          {oldLicences.length > 0 && (
            <div className="mt-6 space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setShowOldLicences(!showOldLicences)}
              >
                {showOldLicences ? 'Masquer les anciennes licences' : 'Afficher les anciennes licences'}
                {showOldLicences ? (
                  <ChevronUpCircle className="h-4 w-4" />
                ) : (
                  <ChevronDownCircle className="h-4 w-4" />
                )}
              </Button>

              {showOldLicences && (
                <div className="space-y-4 pt-2">
                  {oldLicences.map((licence) => (
                    <LicenceItem key={licence.id} licence={licence} isOld={true} />
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {isModalOpen && (
        <ModalAddLicence isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </Card>
  );
};

export default LicenceList;