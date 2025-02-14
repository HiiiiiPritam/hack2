export interface User {
    id: string;
    role: 'ADMIN' | 'POLICE' | 'SOCIETY' | 'GUARD';
    name: string;
    organizationId?: string;
  }
  
  export interface Guard {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    location?: {
      lat: number;
      lng: number;
    };
    currentShift?: Shift;
  }
  
  export interface Shift {
    id: string;
    startTime: Date;
    endTime: Date;
    guardId: string;
    areaId: string;
  }
  