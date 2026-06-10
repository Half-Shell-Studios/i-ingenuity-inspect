import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ACCENT_COLOUR, BRAND_COLOUR_GREY } from '../constants/colours';
import Choice from './Choice';

type Option = {
	label: string;
	value: string;
};

type FiltersModalRef = {
	open: () => void;
	close: () => void;
}

function FilterOption({ option, selected }: { option: Option; selected: boolean; }) {
	return (
		<Choice label={ option.label } value={ option.value } selected={ selected } />
	)
}

function FiltersModal({ options, selectedValue, onSelect, ref, children }: { options: Option[]; selectedValue: string; onSelect: (value: string) => void; ref: React.ForwardedRef<FiltersModalRef>; children?: React.ReactNode }) {
	const [ modalOpen, setModalOpen ] = useState<boolean>( false );
	
	function open() {
		setModalOpen( true );
	}
	
	function close() {
		setModalOpen( false );
	}

	useImperativeHandle(ref, () => ({ open, close }), []);

	return (
		<Modal transparent visible={ modalOpen } animationType="slide">
			<View style={{ flex: 1, justifyContent: "flex-end" }}>
				<Pressable style={ styles.modalBackground } onPress={ close }></Pressable>
				<View style={ styles.modalContentContainer }>
					<View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee", marginBottom: 5 }}>
						<Button title="Done" onPress={ () => setModalOpen( false ) } />
					</View>
					{ children }
					<ScrollView>
						{options.map( option => (
							<Pressable key={ option.value } onPress={() => onSelect( option.value ) }>
								<FilterOption option={ option } selected={ selectedValue === option.value } />
							</Pressable>
						))}
					</ScrollView>
				</View>
			</View>
		</Modal>
	)
}

export default function LocationFilter({ placeholder, options }: { placeholder?: string; options: Option[] }) {
	const filtersModal = useRef<FiltersModalRef>(null);
	const [ selectedOption, setSelectedOption ] = useState( '' );

	const openModal = () => {
		filtersModal.current?.open();
	}

	useEffect(() => {
		filtersModal.current?.close();
	}, [ selectedOption ])

	return (
		<View>
			<Pressable style={{ padding: 10, borderWidth: 1, borderColor: ACCENT_COLOUR, borderRadius: 4 }} onPress={ openModal }>
				{ !!selectedOption ? (
					<Text style={{ color: ACCENT_COLOUR }}>{ options.find( option => option.value === selectedOption )?.label ?? 'Add a Filter' }</Text>
				) : (
					<Text style={{ color: BRAND_COLOUR_GREY }}>{ placeholder ?? 'Add a Filter' }</Text>
				)}
			</Pressable>
			<FiltersModal ref={ filtersModal } options={ options } selectedValue={ selectedOption } onSelect={ setSelectedOption } />
		</View>
	)
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: '#000000',
		opacity: 0.2
	},
	modalContentContainer: {
		backgroundColor: "white",
		minHeight: 250,
		maxHeight: 500,
	}
});