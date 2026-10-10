import type { Token } from '$stylist/token/type/object/token';
import { TOKEN_COMPONENT_TYPE } from '$stylist/token/const/array/component-type';
import { TOKEN_CONNECTOR } from '$stylist/animation/const/array/connector';
import { TOKEN_FOUNDATION_AXES } from '$stylist/canvas/const/array/foundation-axes';
import { TOKEN_FOUNDATION_AXIS_DIRECTIONS } from '$stylist/canvas/const/array/foundation-axis-directions';
import { TOKEN_FUNCTIONAL_TAXONOMY } from '$stylist/token/const/array/functional-taxonomy';
import { GRAPH_GRID_MODE } from '$stylist/graph/const/array/graph-grid-mode';
import { GRAPH_NODE_CATEGORY } from '$stylist/graph/const/array/graph-node-category';
import { GRAPH_TOOL_MODE } from '$stylist/graph/const/array/graph-tool-mode';
import { TOKEN_LINE_TYPE } from '$stylist/chart/const/array/line-type';
import { TOKEN_MARKER } from '$stylist/notification/const/array/marker';
import { NODE_TITLE_VARIANT } from '$stylist/workspace/const/array/node-title-variant';
import { TOKEN_NODE_TYPE } from '$stylist/workspace/const/array/node-type';
import { TOKEN_PAN_MODES } from '$stylist/workspace/const/array/pan-mode';
import { TOKEN_PROPERTY_TYPE } from '$stylist/workspace/const/array/property-type';
import { TOKEN_RELATIONSHIP } from '$stylist/workspace/const/array/relationship';
import { SELECTION_MODE } from '$stylist/control/const/array/selection-mode';
import { TOKEN_ARCHITECTURE_SHADER_FRAGMENT } from '$stylist/webgl/const/array/shader-fragment';
import { TOKEN_ARCHITECTURE_SHADER_VERTEX } from '$stylist/webgl/const/array/shader-vertex';
import { TOKEN_SKELETON } from '$stylist/layout/const/array/skeleton';
import { TOKEN_TIER_CONTENT } from '$stylist/layout/const/array/tier';
import { TOKEN_TRAJECTORY } from '$stylist/workspace/const/array/trajectory';

export const TOKEN_ARCHITECTURE_SETTING = [
	{
		key: 'component-type',
		label: 'Component Type',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_COMPONENT_TYPE
	},
	{
		key: 'connector',
		label: 'Connector',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_CONNECTOR
	},
	{
		key: 'foundation-axes',
		label: 'Foundation Axes',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_FOUNDATION_AXES
	},
	{
		key: 'foundation-axis-directions',
		label: 'Foundation Axis Directions',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_FOUNDATION_AXIS_DIRECTIONS
	},
	{
		key: 'functional-taxonomy',
		label: 'Functional Taxonomy',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_FUNCTIONAL_TAXONOMY
	},
	{
		key: 'graph-grid-mode',
		label: 'Graph Grid Mode',
		domain: 'architecture',
		controlKind: 'radio',
		values: GRAPH_GRID_MODE
	},
	{
		key: 'graph-node-category',
		label: 'Graph Node Category',
		domain: 'architecture',
		controlKind: 'radio',
		values: GRAPH_NODE_CATEGORY
	},
	{
		key: 'graph-tool-mode',
		label: 'Graph Tool Mode',
		domain: 'architecture',
		controlKind: 'radio',
		values: GRAPH_TOOL_MODE
	},
	{
		key: 'line-type',
		label: 'Line Type',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_LINE_TYPE
	},
	{
		key: 'marker',
		label: 'Marker',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_MARKER
	},
	{
		key: 'node-title-variant',
		label: 'Node Title Variant',
		domain: 'architecture',
		controlKind: 'radio',
		values: NODE_TITLE_VARIANT
	},
	{
		key: 'node-type',
		label: 'Node Type',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_NODE_TYPE
	},
	{
		key: 'pan-mode',
		label: 'Pan Mode',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_PAN_MODES
	},
	{
		key: 'property-type',
		label: 'Property Type',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_PROPERTY_TYPE
	},
	{
		key: 'relationship',
		label: 'Relationship',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_RELATIONSHIP
	},
	{
		key: 'selection-mode',
		label: 'Selection Mode',
		domain: 'architecture',
		controlKind: 'radio',
		values: SELECTION_MODE
	},
	{
		key: 'shader-fragment',
		label: 'Shader Fragment',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_ARCHITECTURE_SHADER_FRAGMENT
	},
	{
		key: 'shader-vertex',
		label: 'Shader Vertex',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_ARCHITECTURE_SHADER_VERTEX
	},
	{
		key: 'skeleton',
		label: 'Skeleton',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_SKELETON
	},
	{
		key: 'tier',
		label: 'Tier',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_TIER_CONTENT
	},
	{
		key: 'trajectory',
		label: 'Trajectory',
		domain: 'architecture',
		controlKind: 'radio',
		values: TOKEN_TRAJECTORY
	}
] satisfies readonly Token[];
