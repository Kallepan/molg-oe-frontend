export interface  Sample {
    created_by: string,
    created_at: string,
    tagesnummer: string,
    full_rack_position: string,
    internal_number: string,
    archived_at?: string,
    archived_by?: string,
    archived: boolean,
    dpdl: boolean,
    dummy?: boolean,

    
    displaySampleId?: string,
  }

export type PrintSample = {
  tagesnummer: string,
  internalNumber: string
} 