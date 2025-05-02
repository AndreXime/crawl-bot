import type { Page } from 'puppeteer-extra-plugin/dist/puppeteer';
export { Page };

export interface DataType {
	Titulo: string;
	Texto?: {
		tag: string;
		text: string;
	}[];
	Imagens?: { src: string; alt: string }[];
	Metadata?: { name: string; content: string }[];
	Custom?: { text: string }[];
}
