import { AttestationScoreType } from '../../common/types';

export class AttestationCreatePayload {
  subject: number;
  student: string;
  score: AttestationScoreType;
}

export class AttestationUpdatePayload {
  score: AttestationScoreType;
}
