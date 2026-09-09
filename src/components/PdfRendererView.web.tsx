import { createElement } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type PdfSource = string | number | { uri: string };

type PdfRendererViewProps = {
	source?: PdfSource;
	style?: StyleProp<ViewStyle>;
	testID?: string;
	distanceBetweenPages?: number;
	maxZoom?: number;
	maxPageResolution?: number;
	singlePage?: boolean;
	onPageChange?: (page: number, totalPages: number) => void;
	onError?: () => void;
};

function resolveUri( source?: PdfSource ): string | undefined {
	if( typeof source === 'string' ) return source;
	if( source && typeof source === 'object' && 'uri' in source ) return source.uri;
	return undefined;
}

export default function PdfRendererView({ source, style, testID }: PdfRendererViewProps) {
	const uri = resolveUri( source );

	return (
		<View testID={ testID } style={ [ styles.container, style ] }>
			{ uri
				? createElement( 'iframe', {
					src: uri,
					title: 'PDF preview',
					style: { width: '100%', height: '100%', border: 'none' },
				} )
				: <Text style={ styles.message }>PDF preview is available on iOS and Android.</Text>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 480,
		backgroundColor: '#e5e7eb',
		overflow: 'hidden',
	},
	message: {
		padding: 16,
		color: '#4b5563',
	},
});
