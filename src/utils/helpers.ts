type JsonValue = | string | number | boolean | null | JsonValue[] | {[ key: string ]: JsonValue };

export function convertNullStrings(value: JsonValue): JsonValue {
	if( Array.isArray( value ) ) {
		return value.map(convertNullStrings);
	}

	if( value !== null && typeof value === "object" ) {
		return Object.fromEntries(
			Object.entries( value ).map(([ key, val ]) => [ key, convertNullStrings( val ) ])
		);
	}

	return value === "null" ? null : value;
}