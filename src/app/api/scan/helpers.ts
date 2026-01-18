import { Port, ScanResult } from "./types";


export function transformNmapXml(xmlData: any): ScanResult {
  const result: ScanResult = {
    target: '',
    status: 'unknown',
    ports: []
  };

  try {
    const nmaprun = xmlData.nmaprun;
    
    // Extract target and status
    if (nmaprun.host && nmaprun.host[0]) {
      const host = nmaprun.host[0];
      
      // Get target address
      if (host.address && host.address[0] && host.address[0].$) {
        result.target = host.address[0].$.addr;
      }
      
      // Get host status
      if (host.status && host.status[0] && host.status[0].$) {
        result.status = host.status[0].$.state;
      }
      
      // Extract ports
      if (host.ports && host.ports[0] && host.ports[0].port) {
        result.ports = host.ports[0].port.map((port: any) => {
          const portData: Port = {
            portNumber: port.$.portid || 'unknown',
            protocol: port.$.protocol || 'unknown',
            service: 'unknown'
          };
          
          if (port.service && port.service[0] && port.service[0].$) {
            portData.service = port.service[0].$.name || 'unknown';
          }
          
          return portData;
        });
      }
    }
  } catch (error) {
    console.error('Error transforming XML:', error);
  }

  return result;
}


// Strict regex for IP addresses (IPv4) and domain names
const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function validateTarget(target: string): boolean {
  return IP_REGEX.test(target) || DOMAIN_REGEX.test(target);
}

export function cleanTarget(target:string): string {
  const clean = target.replace(/^https?:\/\//, '').split('/')[0];
  return clean;
}