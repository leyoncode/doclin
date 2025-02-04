import Quill from 'quill';
import 'quill-mention';
import type { UserDTO } from '$shared/types/UserDTO';

export class TextEditor {
  private quillInstance: Quill;

  constructor(selector: string, suggestedUsersList: UserDTO[] = []) {
    const defaultOptions = {
      modules: {
        toolbar: [
          [
            'bold',
            'italic',
            'link',
            'blockquote',
            'code-block',
            { list: 'ordered' },
            { list: 'bullet' },
            { color: [] },
            { background: [] },
            'clean',
          ],
        ],
        mention: {
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          mentionDenotationChars: ['@'],
          source: function (searchTerm: string, renderList: any, mentionChar: string) {
            const values = suggestedUsersList.map(({ id, name }) => {
              return { id: id, value: name };
            });

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];
              for (let i = 0; i < values.length; i++) {
                if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) {
                  matches.push(values[i]);
                }
              }
              renderList(matches, searchTerm);
            }
          },
        },
      },
      theme: 'snow',
      placeholder: 'Description',
    };

    this.quillInstance = new Quill(selector, defaultOptions);
  }

  getContents(): any {
    return JSON.stringify(this.quillInstance.getContents());
  }

  setContents(delta: any): void {
    this.quillInstance.setContents(this.parseJSON(delta));
  }

  setText(text: string): void {
    this.quillInstance.setText(text);
  }

  getStructuredText(): {
    delta: any;
    message: string;
    snippets: any;
    mentionedUserIds: number[];
  } {
    const delta = this.quillInstance.getContents();

    const { sanitizedDelta, mentionedUserIds } = this.sanitizeMentionDelta(delta);
    const message = this.getHtmlFromDelta(delta);

    return { delta: sanitizedDelta, message: message, snippets: [], mentionedUserIds };
  }

  private sanitizeMentionDelta(delta: any) {
    const mentionedUserIds: any[] = [];
    const sanitizedDelta = delta.map((op: any) => {
      const mention = op.insert?.mention;
      if (mention) {
        const mentionedUserId = mention.id;
        mentionedUserIds.push(mentionedUserId);
        return { insert: { mention: JSON.parse(JSON.stringify(mention)) } };
      }
      return op;
    });

    return { sanitizedDelta, mentionedUserIds };
  }

  private getHtmlFromDelta(delta: any): string {
    const newQuill = new Quill(document.createElement('div'));
    newQuill.setContents(delta);
    return newQuill.root.innerHTML;
  }

  onTextChange(callback: () => void): void {
    this.quillInstance.on('text-change', callback);
  }

  private parseJSON(data: any) {
    try {
      if (typeof data === 'string') {
        return JSON.parse(data);
      } else if (typeof data === 'object') {
        return JSON.parse(JSON.stringify(data));
      } else {
        throw new Error('Invalid data type. Expected string or object.');
      }
    } catch (error: unknown) {
      console.log(error);
      return null;
    }
  }
}
