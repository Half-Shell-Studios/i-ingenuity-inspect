declare module "*.svg" {
	import React from 'react';
	import { SvgProps } from 'react-native-svg';
	const content: React.FC<SvgProps>;
	export default content;
}

declare module "*.pdf" {
	const src: string | number;
	export default src;
}