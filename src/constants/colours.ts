
import { Appearance } from "react-native";

export const BRAND_COLOUR_BLUE = '#2500fd';
export const BRAND_COLOUR_YELLOW = '#fff006';
export const BRAND_COLOUR_NAVY = '#151732';
export const BRAND_COLOUR_PURPLE = '#8e51ff';
export const BRAND_COLOUR_GREY = '#e5e5e5';
export const BRAND_COLOUR_DARK_GREY = '#7f7f7f';
export const BRAND_COLOUR_OFFWHITE = '#f5f5f5';
export const BRAND_COLOUR_WHITE = '#ffffff';

export const PRIMARY_COLOUR = BRAND_COLOUR_BLUE;
export const SECONDARY_COLOUR = BRAND_COLOUR_YELLOW;
export const ACCENT_COLOUR = BRAND_COLOUR_PURPLE;

export const darkModeActive = ( Appearance.getColorScheme() === 'dark' );