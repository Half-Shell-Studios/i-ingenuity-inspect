export interface Location {
	id: string,
	customerName?: string,
	siteName?: string,
	plantName?: string,
	areaName?: string
}

export interface Customer {
	customerName: string;
}

export interface Site {
	siteName: string;
}

export interface Plant {
	plantName: string;
}

export interface Area {
	areaName: string;
}

export interface GroupedLocations {
	id: string,
	customer: Customer,
	sites: Site[]
}

export default Location;