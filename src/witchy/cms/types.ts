export interface Metadata {
	title: string;
	description?: string;
	date: string;           // ← what you wanted to sort by
	author?: string;
	cover?: string;
	avatar?: string;
	emoji?: string;
	tags?: string[];
}

export interface Categrory {
	slug: string;
	metadata: Metadata;
}

export interface Post {
	Content: React.ComponentType
	slug: string;
	metadata: Metadata;
}