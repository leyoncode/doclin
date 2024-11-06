import { SnippetRequestDTO } from './SnippetRequestDTO';

export interface ReplyUpdateDTO {
  message: string;
  delta: any;
  snippets: SnippetRequestDTO[];
}
