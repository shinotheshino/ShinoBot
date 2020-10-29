export function escapeMarkdown(content: string): string {
  content = content.replace(/(\*|_|`|~|\\|\<|\|)/g, "\\$1").replace(/@(everyone|here)/g, "@\u200b$1");
  return content;
}
