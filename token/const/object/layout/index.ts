import type { Token } from '$stylist/token/type/object/token';
import { TOKEN_ALIGNMENT } from '$stylist/layout/const/array/alignment';
import { TOKEN_BACKGROUND } from '$stylist/layout/const/array/background';
import { TOKEN_BORDER_STYLE } from '$stylist/layout/const/array/border-style';
import { TOKEN_BREAKPOINT } from '$stylist/layout/const/array/breakpoint';
import { CENTERED_LAYOUT_AXIS } from '$stylist/layout/const/array/centered-layout-axis';
import { TOKEN_COLUMN } from '$stylist/layout/const/array/column';
import { CONTAINER_QUERY_TYPE } from '$stylist/layout/const/array/container-query-type';
import { TOKEN_DENSITY } from '$stylist/layout/const/array/density';
import { GRID_MOLECULE_JUSTIFY } from '$stylist/layout/const/array/grid-molecule-justify';
import { TOKEN_IMAGE_FILTER } from '$stylist/layout/const/array/image-filter';
import { ITEM_LAYOUT_GRAVITY } from '$stylist/layout/const/array/item-layout-gravity';
import { ITEM_LAYOUT_LEVEL } from '$stylist/layout/const/array/item-layout-level';
import { ITEM_LAYOUT_SHAPE } from '$stylist/layout/const/array/item-layout-shape';
import { TOKEN_JUSTIFICATION } from '$stylist/layout/const/array/justification';
import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';
import { TOKEN_SHAPE } from '$stylist/layout/const/array/shape';
import { TOKEN_SIZE } from '$stylist/design-token/const/array/size';
import { TOKEN_SIZE_PX } from '$stylist/design-token/const/array/size-px';
import { TOKEN_SIZE_REM } from '$stylist/design-token/const/array/size-rem';
import { SPLIT_LAYOUT_GAP } from '$stylist/layout/const/array/split-layout-gap';
import { TOKEN_STACK_DIRECTION } from '$stylist/layout/const/array/stack-direction';

export const TOKEN_LAYOUT_SETTING = [
	{
		key: 'alignment',
		label: 'Alignment',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_ALIGNMENT
	},
	{
		key: 'background',
		label: 'Background',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_BACKGROUND
	},
	{
		key: 'border-style',
		label: 'Border Style',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_BORDER_STYLE
	},
	{
		key: 'breakpoint',
		label: 'Breakpoint',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_BREAKPOINT
	},
	{
		key: 'centered-layout-axis',
		label: 'Centered Layout Axis',
		domain: 'layout',
		controlKind: 'radio',
		values: CENTERED_LAYOUT_AXIS
	},
	{ key: 'column', label: 'Column', domain: 'layout', controlKind: 'radio', values: TOKEN_COLUMN },
	{
		key: 'container-query-type',
		label: 'Container Query Type',
		domain: 'layout',
		controlKind: 'radio',
		values: CONTAINER_QUERY_TYPE
	},
	{
		key: 'density',
		label: 'Density',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_DENSITY
	},
	{
		key: 'grid-molecule-justify',
		label: 'Grid Molecule Justify',
		domain: 'layout',
		controlKind: 'radio',
		values: GRID_MOLECULE_JUSTIFY
	},
	{
		key: 'image-filter',
		label: 'Image Filter',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_IMAGE_FILTER
	},
	{
		key: 'item-layout-gravity',
		label: 'Item Layout Gravity',
		domain: 'layout',
		controlKind: 'radio',
		values: ITEM_LAYOUT_GRAVITY
	},
	{
		key: 'item-layout-level',
		label: 'Item Layout Level',
		domain: 'layout',
		controlKind: 'radio',
		values: ITEM_LAYOUT_LEVEL
	},
	{
		key: 'item-layout-shape',
		label: 'Item Layout Shape',
		domain: 'layout',
		controlKind: 'radio',
		values: ITEM_LAYOUT_SHAPE
	},
	{
		key: 'justification',
		label: 'Justification',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_JUSTIFICATION
	},
	{
		key: 'orientation',
		label: 'Orientation',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_ORIENTATION
	},
	{ key: 'shape', label: 'Shape', domain: 'layout', controlKind: 'radio', values: TOKEN_SHAPE },
	{ key: 'size', label: 'Size', domain: 'layout', controlKind: 'radio', values: TOKEN_SIZE },
	{
		key: 'size-px',
		label: 'Size Px',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_SIZE_PX
	},
	{
		key: 'size-rem',
		label: 'Size Rem',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_SIZE_REM
	},
	{
		key: 'split-layout-gap',
		label: 'Split Layout Gap',
		domain: 'layout',
		controlKind: 'radio',
		values: SPLIT_LAYOUT_GAP
	},
	{
		key: 'stack-direction',
		label: 'Stack Direction',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_STACK_DIRECTION
	}
] satisfies readonly Token[];
