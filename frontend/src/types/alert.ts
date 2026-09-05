type AlertModeType = 'success' | 'info' | 'warning' | 'error';

export interface IAlert {
  message: string;
  status?: number;
  type: AlertModeType;
}
