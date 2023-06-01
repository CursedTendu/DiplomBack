import { AttestationScoreType } from '../../common/types';

export class AttestationCreatePayload {
  subject: number;
  student: string;
  score: AttestationScoreType;
}

export class AttestationUpdatePayload {
  score: AttestationScoreType;
}

export class CalculateAttestationDto {
  percent?: PercentAttestation;
  points?: PointsAttestion;
  groupId: number;
  subjectId: number;
}

export class PercentAttestation {
  onePoint: number;
  twoPoint: number;
}

export class PointsAttestion {
  onePoint: number;
  twoPoint: number;
}
