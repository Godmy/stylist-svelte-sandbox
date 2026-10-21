import MockDataSelector from './index.svelte';
import type { RecipeMockDataSelector } from '$stylist/development/interface/recipe/mock-data-selector';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Selector for mock data schemas with filtering and preview capabilities. */
export default {
	component: MockDataSelector,
	title: 'MockDataSelector',
	description: 'Selector for mock data schemas with filtering and preview capabilities.',
	args: {
		title: 'Mock Data Selector',
		description: 'Select mock data schemas to generate sample data',
		allowMultipleSelections: true,
		allowFieldSelection: true,
		allowCustomCount: true,
		showSearch: true,
		showTagsFilter: true,
		schemas: [
			{
				id: 'users',
				name: 'User Data',
				description: 'Sample user data with profile information',
				fields: [
					{ name: 'id', type: 'id', required: true, example: 'user_001' },
					{ name: 'name', type: 'string', required: true, example: 'John Doe' },
					{ name: 'email', type: 'email', required: true, example: 'john@example.com' },
					{ name: 'age', type: 'number', required: false, example: '30' },
					{ name: 'active', type: 'boolean', required: false, example: 'true' }
				],
				sampleData: [],
				tags: ['user', 'profile', 'authentication']
			},
			{
				id: 'products',
				name: 'Product Data',
				description: 'Sample product data for e-commerce',
				fields: [
					{ name: 'id', type: 'id', required: true, example: 'prod_001' },
					{ name: 'name', type: 'string', required: true, example: 'Laptop' },
					{ name: 'price', type: 'number', required: true, example: '999.99' },
					{ name: 'category', type: 'string', required: false, example: 'Electronics' }
				],
				sampleData: [],
				tags: ['product', 'ecommerce', 'inventory']
			},
			{
				id: 'orders',
				name: 'Order Data',
				description: 'Sample order data for transactions',
				fields: [
					{ name: 'id', type: 'id', required: true, example: 'order_001' },
					{ name: 'userId', type: 'id', required: true, example: 'user_001' },
					{ name: 'total', type: 'number', required: true, example: '199.98' },
					{ name: 'status', type: 'string', required: false, example: 'completed' }
				],
				sampleData: [],
				tags: ['order', 'transaction', 'sales']
			}
		]
	},
	controls: {
		title: { type: 'text' },
		description: { type: 'text' },
		allowMultipleSelections: { type: 'boolean' },
		allowFieldSelection: { type: 'boolean' },
		allowCustomCount: { type: 'boolean' },
		showSearch: { type: 'boolean' },
		showTagsFilter: { type: 'boolean' }
	},
	presets: {
		'Single selection': { allowMultipleSelections: false, allowFieldSelection: false }
	}
} satisfies ContractStory<RecipeMockDataSelector>;
