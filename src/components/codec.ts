export interface BookingData {
  id: string;
  name: string;
  service: string;
  clinic: string;
  date: string;
  session: string;
  phone?: string;
  nationality?: string;
  email?: string;
  destination?: string;
  notes?: string;
  referral?: string;
}

export function encodeBooking(booking: BookingData): string {
  const shortObj = {
    id: booking.id,
    nm: booking.name,
    sv: booking.service,
    cl: booking.clinic,
    dt: booking.date,
    sn: booking.session,
    ph: booking.phone || '',
    na: booking.nationality || '',
    em: booking.email || '',
    ds: booking.destination || '',
    ns: booking.notes || '',
    rf: booking.referral || '',
  };

  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(shortObj)) {
    if (value) {
      cleaned[key] = value;
    }
  }

  const json = JSON.stringify(cleaned);
  const utf8Bytes = new TextEncoder().encode(json);
  const binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('');
  
  return btoa(binaryString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeBooking(token: string): BookingData | null {
  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const json = new TextDecoder().decode(bytes);
    const shortObj = JSON.parse(json);

    return {
      id: shortObj.id || 'UCS-PENDING-XX',
      name: shortObj.nm || 'Valued Guest',
      service: shortObj.sv || 'Premium Dental Solution',
      clinic: shortObj.cl || 'Any Vetted Partner Clinic',
      date: shortObj.dt || 'To Be Arranged',
      session: shortObj.sn || 'Flexible Time Window',
      phone: shortObj.ph || '',
      nationality: shortObj.na || '',
      email: shortObj.em || '',
      destination: shortObj.ds || '',
      notes: shortObj.ns || '',
      referral: shortObj.rf || '',
    };
  } catch (error) {
    console.error('Failed to decode booking token', error);
    return null;
  }
}
