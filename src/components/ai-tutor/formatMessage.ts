/**
 * Lightweight message formatter for AI tutor responses.
 * Converts markdown-like syntax to HTML without external dependencies.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatMessage(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check for bullet list items
    const bulletMatch = line.match(/^[\s]*[-•*]\s+(.+)/);
    // Check for numbered list items
    const numberedMatch = line.match(/^[\s]*\d+[.)]\s+(.+)/);

    if (bulletMatch) {
      if (listType !== 'ul') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ul class="list-disc pl-5 my-1 space-y-0.5">');
        listType = 'ul';
        inList = true;
      }
      result.push(`<li>${formatInline(bulletMatch[1])}</li>`);
      continue;
    }

    if (numberedMatch) {
      if (listType !== 'ol') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ol class="list-decimal pl-5 my-1 space-y-0.5">');
        listType = 'ol';
        inList = true;
      }
      result.push(`<li>${formatInline(numberedMatch[1])}</li>`);
      continue;
    }

    // Close any open list
    if (inList) {
      result.push(`</${listType}>`);
      inList = false;
      listType = null;
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      result.push('<br/>');
      continue;
    }

    // Regular line
    result.push(`<p>${formatInline(line)}</p>`);
  }

  // Close any remaining open list
  if (inList) {
    result.push(`</${listType}>`);
  }

  return result.join('');
}

function formatInline(text: string): string {
  let result = escapeHtml(text);

  // Bold: **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (but not inside words with underscores)
  result = result.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, '<em>$1</em>');
  result = result.replace(/(?<!\w)_([^_]+?)_(?!\w)/g, '<em>$1</em>');

  // Inline code: `text`
  result = result.replace(/`([^`]+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

  return result;
}
