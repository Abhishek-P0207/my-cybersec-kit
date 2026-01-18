
export interface Port {
  portNumber: string;
  protocol: string;
  service: string;
}

export interface ScanResult {
  target: string;
  status: string;
  ports: Port[];
}