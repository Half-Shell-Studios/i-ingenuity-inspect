export interface Location {
	id: string,
	customerName?: string,
	siteName?: string,
	plantName?: string,
	areaName?: string
}

export interface Customer {
	id?: string;
	customerName: string;
}

export interface Site {
	id?: string;
	siteName: string;
}

export interface Plant {
	id?: string;
	plantName: string;
}

export interface Area {
	id?: string;
	areaName: string;
}

export interface GroupedLocations {
	id: string,
	customer: Customer,
	sites: Site[]
}

export default Location;